// 리팩터링 전후 비교(골든 마스터) 도구.
//   GoldenDump gen <기준exe> <시나리오.txt>             : 기준 exe 로 시나리오 목록을 만든다
//   GoldenDump run <대상exe> <시나리오.txt> <결과.txt>   : 시나리오를 폼에서 실행하고 모든 화면/계산 값을 기록한다
// 같은 시나리오로 리팩터링 전/후 exe 를 돌려 결과 파일을 diff 하면 동작이 같은지 확인할 수 있다.
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Windows.Forms;

static class P
{
    delegate bool EnumProc(IntPtr h, IntPtr l);
    [DllImport("user32.dll")] static extern bool EnumWindows(EnumProc cb, IntPtr l);
    [DllImport("user32.dll")] static extern int GetClassName(IntPtr h, StringBuilder sb, int max);
    [DllImport("user32.dll")] static extern uint GetWindowThreadProcessId(IntPtr h, out uint pid);
    [DllImport("user32.dll")] static extern bool PostMessage(IntPtr h, uint msg, IntPtr w, IntPtr l);
    static int msgBoxCount = 0;
    static int scenarioStartMsgBox = 0;
    static StringBuilder threadErrors = new StringBuilder();

    static Assembly asm;
    static Type tF1, tF4;
    const BindingFlags ANY = BindingFlags.Instance | BindingFlags.Static | BindingFlags.Public | BindingFlags.NonPublic;

    [STAThread]
    static int Main(string[] a)
    {
        if (a.Length < 3) { Console.WriteLine("usage: gen|run exe scen [out]"); return 1; }
        Application.SetUnhandledExceptionMode(UnhandledExceptionMode.CatchException);
        Application.ThreadException += (sender, e) => { lock (threadErrors) threadErrors.AppendLine("THREADEXC " + e.Exception.GetType().Name + ": " + e.Exception.Message); };
        asm = Assembly.LoadFrom(Path.GetFullPath(a[1]));
        tF1 = asm.GetType("WindowsFormsApp1.Form1", true);
        tF4 = asm.GetType("WindowsFormsApp1.Form4", true);

        // 이 프로세스에서 메시지박스가 뜨면 닫고 횟수를 센다 (잘못된 입력 처리 확인용)
        uint myPid = (uint)System.Diagnostics.Process.GetCurrentProcess().Id;
        var wd = new Thread(() =>
        {
            while (true)
            {
                EnumWindows((h, l) =>
                {
                    var cls = new StringBuilder(32);
                    GetClassName(h, cls, 32);
                    if (cls.ToString() != "#32770") return true;
                    uint pid; GetWindowThreadProcessId(h, out pid);
                    if (pid != myPid) return true;
                    Interlocked.Increment(ref msgBoxCount);
                    PostMessage(h, 0x0010, IntPtr.Zero, IntPtr.Zero);
                    return true;
                }, IntPtr.Zero);
                Thread.Sleep(15);
            }
        });
        wd.IsBackground = true; wd.Start();

        if (a[0] == "gen") Gen(a[2]);
        else if (a[0] == "tongi") Tongi(a[2], a[3]);
        else if (a[0] == "sinsoo") Sinsoo(a[2], a[3]);
        else Run(a[2], a[3]);
        return 0;
    }

    // ---------------------------------------------------------------- 폼 조작
    static Form NewForm1()
    {
        Form f = (Form)Activator.CreateInstance(tF1);
        f.StartPosition = FormStartPosition.Manual;
        f.Location = new Point(-3000, -3000);
        f.ShowInTaskbar = false;
        f.Show();
        Application.DoEvents();
        return f;
    }

    static Control C(Control root, string name)
    {
        Control[] r = root.Controls.Find(name, true);
        if (r.Length == 0) throw new Exception("control not found: " + name);
        return r[0];
    }
    static void Check(Control root, string name, bool v) { ((RadioButton)C(root, name)).Checked = v; }
    static void Click(Form f, string name) { ((Button)C(f, name)).PerformClick(); Application.DoEvents(); }
    static object GetF(object o, string n) { return o.GetType().GetField(n, ANY).GetValue(o); }

    // 계산: 양력(1)/음력(2)/윤달음력(3)
    static void SetupA(Form f, int y, int m, int d, int h, int mi, int gender, int cal, bool tongi1)
    {
        Check(f, "radioButton6", false);
        Check(f, cal == 1 ? "radioButton1" : cal == 2 ? "radioButton2" : "radioButton3", true);
        Check(f, gender == 1 ? "radioButton4" : "radioButton5", true);
        Check(f, tongi1 ? "radioButton8" : "radioButton7", true);
        C(f, "textBox6").Text = "아무개";
        ((DateTimePicker)C(f, "dateTimePicker1")).Value = new DateTime(y, m, d, h, mi, 0);
    }

    // ---------------------------------------------------------------- 덤프
    static void DumpObj(StringBuilder sb, string path, object o, int depth)
    {
        if (o == null) { sb.AppendLine(path + "=null"); return; }
        Type t = o.GetType();
        if (t.IsPrimitive || o is string || t.IsEnum) { sb.AppendLine(path + "=" + Convert.ToString(o, CultureInfo.InvariantCulture)); return; }
        if (o is DateTime) { sb.AppendLine(path + "=" + ((DateTime)o).ToString("yyyy-MM-dd HH:mm:ss.fff", CultureInfo.InvariantCulture)); return; }
        if (o is Array)
        {
            Array ar = (Array)o;
            if (ar.Rank == 1) for (int i = 0; i < ar.Length; i++) DumpObj(sb, path + "[" + i + "]", ar.GetValue(i), depth + 1);
            else for (int i = 0; i < ar.GetLength(0); i++) for (int j = 0; j < ar.GetLength(1); j++) DumpObj(sb, path + "[" + i + "," + j + "]", ar.GetValue(i, j), depth + 1);
            return;
        }
        if (depth > 4 || o is Control) return;
        foreach (FieldInfo fi in t.GetFields(BindingFlags.Instance | BindingFlags.Public))
            DumpObj(sb, path + "." + fi.Name, fi.GetValue(o), depth + 1);
    }

    static string Sha(string s)
    {
        using (var h = SHA1.Create()) return BitConverter.ToString(h.ComputeHash(Encoding.UTF8.GetBytes(s ?? ""))).Replace("-", "");
    }

    static void DumpControls(StringBuilder sb, Control c, string prefix)
    {
        foreach (Control ch in c.Controls.Cast<Control>().OrderBy(x => x.Name, StringComparer.Ordinal))
        {
            string kind = ch.GetType().Name;
            string text = ch.Text ?? "";
            string extra = "";
            if (ch is RichTextBox) extra = " rtf=" + Sha(((RichTextBox)ch).Rtf);
            if (ch is ComboBox) { var cb = (ComboBox)ch; extra = " sel=" + cb.SelectedIndex + " items=" + string.Join(";", cb.Items.Cast<object>().Select(x => x.ToString())); }
            if (ch is RadioButton) extra = " chk=" + ((RadioButton)ch).Checked;
            if (ch is DateTimePicker) text = ((DateTimePicker)ch).Value.ToString("yyyy-MM-dd HH:mm:ss");
            sb.AppendLine(prefix + ch.Name + "|" + kind + "|vis=" + ch.Visible + "|fg=" + ch.ForeColor.ToArgb().ToString("X8") + "|bg=" + ch.BackColor.ToArgb().ToString("X8") + "|" + text.Replace("\r", "\\r").Replace("\n", "\\n") + extra);
            DumpControls(sb, ch, prefix + ch.Name + "/");
        }
    }

    static void Dump(StringBuilder sb, string tag, Form f)
    {
        sb.AppendLine("#### " + tag + " (msgbox=" + (msgBoxCount > scenarioStartMsgBox ? "yes" : "no") + ")");
        foreach (FieldInfo fi in f.GetType().GetFields(BindingFlags.Instance | BindingFlags.Public).OrderBy(x => x.Name, StringComparer.Ordinal))
        {
            if (typeof(Control).IsAssignableFrom(fi.FieldType)) continue;
            DumpObj(sb, "F." + fi.Name, fi.GetValue(f), 0);
        }
        DumpControls(sb, f, "");
    }

    static string Fmt(string kind, DateTime dt, int g, int cal, int tongi)
    {
        return string.Format("{0}|{1}|{2}|{3}|{4}|{5}|{6}|{7}|{8}", kind, dt.Year, dt.Month, dt.Day, dt.Hour, dt.Minute, g, cal, tongi);
    }

    // ---------------------------------------------------------------- 시나리오 생성
    static void Gen(string outFile)
    {
        var rnd = new Random(20260101);
        var lines = new List<string>();
        Form f = NewForm1();
        DateTime lo = new DateTime(1901, 1, 1), hi = new DateTime(2050, 2, 9);

        // 1) 일반 무작위 양력 (1901~2050-02)
        for (int i = 0; i < 1400; i++)
        {
            DateTime dt = lo.AddMinutes(rnd.NextDouble() * (hi - lo).TotalMinutes);
            lines.Add(Fmt("A", dt, rnd.Next(2), 1, rnd.Next(2)));
        }
        // 2) 24절기 경계 +-1분 (30개 연도)
        MethodInfo gt = tF1.GetMethod("get24Terms");
        for (int yi = 0; yi < 30; yi++)
        {
            int year = Math.Min(1902 + yi * 5 + rnd.Next(5), 2048);
            DateTime[] terms = (DateTime[])gt.Invoke(f, new object[] { new DateTime(year, 6, 1) });
            for (int k = 0; k < 24; k++)
                foreach (int off in new[] { -1, 0, 1 })
                {
                    DateTime t = terms[k].AddMinutes(off);
                    if (t < lo || t > hi) continue;
                    lines.Add(Fmt("A", t, rnd.Next(2), 1, rnd.Next(2)));
                }
        }
        // 3) 자시 경계, 서머타임/서울시 구간 경계
        foreach (int y in new[] { 1908, 1911, 1912, 1948, 1954, 1955, 1960, 1961, 1987, 1988, 2000, 2024, 2049 })
            for (int t = 0; t < 12; t++)
            {
                DateTime dt = new DateTime(y, 1, 1).AddDays(rnd.Next(365));
                int h = new[] { 0, 1, 22, 23, 23, 0, 11, 12, 13, 5, 6, 7 }[t], mi = new[] { 0, 29, 30, 31, 59, 30, 30, 0, 59, 29, 30, 30 }[t];
                lines.Add(Fmt("A", new DateTime(dt.Year, dt.Month, dt.Day, h, mi, 0), rnd.Next(2), 1, rnd.Next(2)));
            }
        foreach (string[] r in new[] { new[] { "194806010000", "194809130000" }, new[] { "195004010000", "195009100000" }, new[] { "198705100200", "198710110300" }, new[] { "190802010000", "191112312359" }, new[] { "195403210000", "196108090000" } })
            foreach (string s in r)
                foreach (int off in new[] { -61, -60, -1, 0, 1, 29, 30, 31 })
                {
                    DateTime t = DateTime.ParseExact(s, "yyyyMMddHHmm", CultureInfo.InvariantCulture).AddMinutes(off);
                    lines.Add(Fmt("A", t, rnd.Next(2), 1, rnd.Next(2)));
                }
        // 4) 음력 / 윤달 음력 입력 (양력 결과에서 역산)
        MethodInfo tl = tF1.GetMethod("ToLunarDate");
        int lunarCount = 0, leapCount = 0, guard = 0;
        DateTime hi2 = new DateTime(2049, 12, 31);
        while ((lunarCount < 350 || leapCount < 150) && guard++ < 50000)
        {
            DateTime dt = lo.AddMinutes(rnd.NextDouble() * (hi2 - lo).TotalMinutes);
            object[] args = { dt, false, 0, 0, 0 };
            tl.Invoke(f, args);
            bool ly = (bool)args[1]; int ly_y = (int)args[2], ly_m = (int)args[3], ly_d = (int)args[4];
            if (ly_y < 1901 || ly_y > 2049) continue;
            DateTime pick;
            try { pick = new DateTime(ly_y, ly_m, ly_d, dt.Hour, dt.Minute, 0); } catch { continue; }
            if (ly) { if (leapCount >= 150) continue; leapCount++; } else { if (lunarCount >= 350) continue; lunarCount++; }
            lines.Add(Fmt("A", pick, rnd.Next(2), ly ? 3 : 2, rnd.Next(2)));
        }
        // 5) 사주팔자 입력 -> 생시 후보 -> 선택
        for (int i = 0; i < 120; i++)
        {
            if (i < 100)
            {
                DateTime dt = new DateTime(1924, 1, 1).AddMinutes(rnd.NextDouble() * (new DateTime(2044, 1, 1) - new DateTime(1924, 1, 1)).TotalMinutes);
                SetupA(f, dt.Year, dt.Month, dt.Day, dt.Hour, dt.Minute, 1, 1, true);
                Click(f, "gimundungab");
                int[,] sj = (int[,])GetF(f, "sjGanzi");
                lines.Add(string.Format("P|{0},{1},{2},{3},{4},{5},{6},{7}|{8}", sj[0, 0], sj[0, 1], sj[1, 0], sj[1, 1], sj[2, 0], sj[2, 1], sj[3, 0], sj[3, 1], rnd.Next(2)));
            }
            else // 말이 안 되는 조합
                lines.Add(string.Format("P|{0},{1},{2},{3},{4},{5},{6},{7}|{8}", rnd.Next(1, 11), rnd.Next(1, 13), rnd.Next(1, 11), rnd.Next(1, 13), rnd.Next(1, 11), rnd.Next(1, 13), rnd.Next(1, 11), rnd.Next(1, 13), rnd.Next(2)));
        }
        // 6) 계산 후 부가 버튼 (유년소운 5, 홍국기문 7, 변국 6, 통기도 3)
        for (int i = 0; i < 120; i++)
        {
            DateTime dt = lo.AddMinutes(rnd.NextDouble() * (hi2 - lo).TotalMinutes);
            string btn = new[] { "button5", "button7", "button6", "button3", "button5" }[i % 5];
            lines.Add(Fmt("B", dt, rnd.Next(2), 1, rnd.Next(2)) + "|" + btn);
        }
        // 7) 신수운 폼 (행년 연도 오프셋, 월국/년국, 양력/음력/윤달)
        DateTime hi3 = new DateTime(2040, 12, 31);
        for (int i = 0; i < 200; i++)
        {
            DateTime dt = lo.AddMinutes(rnd.NextDouble() * (hi3 - lo).TotalMinutes);
            lines.Add(Fmt("S", dt, rnd.Next(2), 1, rnd.Next(2)) + "|" + new[] { 0, 1, 2, 5, 10, 33 }[rnd.Next(6)] + "|" + rnd.Next(2) + "|" + rnd.Next(3));
        }
        f.Dispose();
        File.WriteAllLines(outFile, lines.ToArray(), new UTF8Encoding(false));
        Console.WriteLine("scenarios: " + lines.Count);
    }

    // ---------------------------------------------------------------- 실행
    // 신수운 폼 덤프: 기본 폼으로 한 사람을 계산한 뒤 신수운 폼(Form4)을 열어 달력/국/통기도/연도를 바꿔가며 실행한다.
    //   GoldenDump sinsoo <exe> <시나리오> <결과>  -- 양력 시나리오(A, cal=1) 사용
    //   각 줄: P(파라미터) / F(Hyear 등) / C(칸 글자) / L(라벨) / M(메시지박스)
    static void Sinsoo(string scenFile, string outFile)
    {
        var sb = new StringBuilder();
        var rnd = new Random(5);
        int n = 0;
        foreach (string line in File.ReadAllLines(scenFile))
        {
            string[] p = line.Split('|');
            if (p[0] != "A" || p[7] != "1") continue;
            if (++n > 130) break;
            for (int rep = 0; rep < 3; rep++)
            {
                bool solar = rnd.Next(2) == 0;
                string[] modes = { "radioButton2", "radioButton1", "radioButton3", "radioButton6" };   // 年局 月局 日局 時局
                int mode = rnd.Next(4);
                bool tongi1 = rnd.Next(2) == 0;
                int off = new[] { 0, 1, 2, 5, 12, 30 }[rnd.Next(6)];
                int tm = 1 + rnd.Next(12), td = 1 + rnd.Next(28), th = rnd.Next(24), tmi = rnd.Next(60);
                sb.AppendLine("======== " + line + " | solar=" + (solar ? 1 : 0) + " mode=" + mode + " tongi=" + (tongi1 ? 1 : 2) + " off=" + off + " tm=" + tm + " td=" + td + " th=" + th + " tmi=" + tmi);
                Form f1 = NewForm1();
                Form f4 = null;
                try
                {
                    SetupA(f1, int.Parse(p[1]), int.Parse(p[2]), int.Parse(p[3]), int.Parse(p[4]), int.Parse(p[5]), int.Parse(p[6]), 1, true);
                    Click(f1, "gimundungab");
                    f4 = (Form)Activator.CreateInstance(tF4, new object[] { f1 });
                    f4.StartPosition = FormStartPosition.Manual; f4.Location = new Point(-3000, -3000); f4.ShowInTaskbar = false;
                    f4.Show(); Application.DoEvents();
                    try { Check(f4, solar ? "radioButton10" : "radioButton9", true); } catch (Exception) { }
                    try { Check(f4, modes[mode], true); } catch (Exception) { }
                    Check(f4, tongi1 ? "radioButton8" : "radioButton7", true);
                    int solarYear = ((DateTime)GetF(f1, "solar_dt")).Year;
                    C(f4, "textBoxYear").Text = (solarYear + off).ToString();
                    if (mode >= 1) C(f4, "textBoxMonth").Text = tm.ToString();
                    if (mode >= 2) C(f4, "textBoxDay").Text = td.ToString();
                    if (mode == 3) { C(f4, "textBoxHour").Text = th.ToString(); C(f4, "textBoxMin").Text = tmi.ToString(); }
                    int before = msgBoxCount;
                    Click(f4, "gimundungab");
                    if (msgBoxCount > before) sb.AppendLine("M|msgbox");
                    sb.AppendLine("F|Hyear=" + GetF(f4, "Hyear"));
                    sb.AppendLine("F|label14=" + C(f4, "label14").Text);
                    sb.AppendLine("F|label56=" + C(f4, "label56").Text.Replace("\r", "").Replace("\n", "/"));
                    foreach (string tb in new[] { "textBoxYear", "textBoxMonth", "textBoxDay", "textBoxHour", "textBoxMin" })
                        sb.AppendLine("F|" + tb + "=" + C(f4, tb).Text);
                    for (int i = 1; i <= 9; i++)
                        sb.AppendLine("C|" + i + "|" + C(f4, "richTextBox" + i).Text.Replace("\r", "").Replace("\n", "/"));
                    foreach (Control c in f4.Controls.Cast<Control>().OrderBy(x => x.Name, StringComparer.Ordinal))
                    {
                        if (c is Label && c.Name.StartsWith("label"))
                            sb.AppendLine("L|" + c.Name + "|" + (c.Visible ? 1 : 0) + "|" + c.ForeColor.ToArgb().ToString("X8") + "|" + c.BackColor.ToArgb().ToString("X8") + "|" + c.Text);
                        else if (c is PictureBox && (c.Name == "pictureBox1" || c.Name == "pictureBox3"))
                            sb.AppendLine("L|" + c.Name + "|" + (c.Visible ? 1 : 0));
                    }
                }
                catch (Exception ex) { sb.AppendLine("M|exception " + (ex.InnerException ?? ex).Message); }
                try { if (f4 != null) f4.Dispose(); } catch (Exception) { }
                f1.Dispose();
            }
        }
        File.WriteAllText(outFile, sb.ToString(), new UTF8Encoding(false));
        Console.WriteLine("sinsoo scenarios: " + n);
    }

    // 통기도 라벨 상태 덤프: 시나리오마다 새 폼으로 단1/단2 를 각각 실행해 라벨의 보임/색/글자를 기록한다.
    //   GoldenDump tongi <exe> <시나리오> <결과>  -- 양력 시나리오(A, cal=1)만 사용
    static void Tongi(string scenFile, string outFile)
    {
        var sb = new StringBuilder();
        int n = 0;
        foreach (string line in File.ReadAllLines(scenFile))
        {
            string[] p = line.Split('|');
            if (p[0] != "A" || p[7] != "1") continue;
            if (++n > 150) break;
            foreach (bool tongi1 in new[] { true, false })
            {
                sb.AppendLine("======== " + line + " mode=" + (tongi1 ? 1 : 2));
                Form f = NewForm1();
                try
                {
                    SetupA(f, int.Parse(p[1]), int.Parse(p[2]), int.Parse(p[3]), int.Parse(p[4]), int.Parse(p[5]), int.Parse(p[6]), 1, tongi1);
                    int before = msgBoxCount;
                    Click(f, "gimundungab");
                    if (msgBoxCount > before) sb.AppendLine("MSGBOX");
                    foreach (Control c in f.Controls.Cast<Control>().OrderBy(x => x.Name, StringComparer.Ordinal))
                    {
                        if (c is Label && c.Name.StartsWith("label"))
                            sb.AppendLine(c.Name + "|" + (c.Visible ? 1 : 0) + "|" + c.ForeColor.ToArgb().ToString("X8") + "|" + c.BackColor.ToArgb().ToString("X8") + "|" + c.Text);
                        else if (c is PictureBox && (c.Name == "pictureBox1" || c.Name == "pictureBox3"))
                            sb.AppendLine(c.Name + "|" + (c.Visible ? 1 : 0));
                    }
                }
                catch (Exception ex) { sb.AppendLine("EXCEPTION " + (ex.InnerException ?? ex).Message); }
                f.Dispose();
            }
        }
        File.WriteAllText(outFile, sb.ToString(), new UTF8Encoding(false));
        Console.WriteLine("tongi scenarios: " + n);
    }

    static void Run(string scenFile, string outFile)
    {
        string[] lines = File.ReadAllLines(scenFile);
        var sb = new StringBuilder();
        Form f = NewForm1();
        int n = 0;
        string[] names = { "comboBox4", "comboBox8", "comboBox3", "comboBox7", "comboBox2", "comboBox6", "comboBox1", "comboBox5" };
        foreach (string line in lines)
        {
            string[] p = line.Split('|');
            sb.AppendLine("======== " + line);
            scenarioStartMsgBox = msgBoxCount;
            try
            {
                if (p[0] == "A" || p[0] == "B" || p[0] == "S")
                {
                    SetupA(f, int.Parse(p[1]), int.Parse(p[2]), int.Parse(p[3]), int.Parse(p[4]), int.Parse(p[5]), int.Parse(p[6]), int.Parse(p[7]), p[8] == "1");
                    Click(f, "gimundungab");
                    Dump(sb, "after-calc", f);
                    if (p[0] == "B")
                    {
                        Click(f, p[9]);
                        Dump(sb, "after-" + p[9], f);
                        if (p[9] == "button5") { Click(f, p[9]); Dump(sb, "after-" + p[9] + "-2", f); }
                    }
                    if (p[0] == "S")
                    {
                        int off = int.Parse(p[9]);
                        Form f4 = (Form)Activator.CreateInstance(tF4, new object[] { f });
                        f4.StartPosition = FormStartPosition.Manual; f4.Location = new Point(-3000, -3000); f4.ShowInTaskbar = false;
                        f4.Show(); Application.DoEvents();
                        Dump(sb, "f4-init", f4);
                        int solarYear = ((DateTime)GetF(f, "solar_dt")).Year;
                        C(f4, "textBoxYear").Text = (solarYear + off).ToString();
                        Check(f4, p[10] == "1" ? "radioButton1" : "radioButton2", true);
                        Check(f4, p[8] == "1" ? "radioButton8" : "radioButton7", true);
                        int calMode = int.Parse(p[11]);   // 0: 양력(10) 1: 음력(9) 2: 윤달 음력(11 이 있으면)
                        if (calMode == 0) Check(f4, "radioButton10", true);
                        else if (calMode == 1) Check(f4, "radioButton9", true);
                        else { var rb = f4.Controls.Find("radioButton11", true); if (rb.Length > 0) ((RadioButton)rb[0]).Checked = true; }
                        Click(f4, "gimundungab");
                        Dump(sb, "f4-calc", f4);
                        f4.Dispose();
                    }
                }
                else if (p[0] == "P")
                {
                    string[] s = p[1].Split(',');
                    Action setPillars = () =>
                    {
                        Check(f, "radioButton6", true);
                        for (int i = 0; i < 8; i++) ((ComboBox)C(f, names[i])).SelectedIndex = int.Parse(s[i]) - 1;
                        ((GroupBox)C(f, "groupBox6")).Visible = false;
                    };
                    Check(f, p[2] == "1" ? "radioButton8" : "radioButton7", true);
                    setPillars();
                    Click(f, "gimundungab");
                    Dump(sb, "palja-candidates", f);
                    int count = ((ComboBox)C(f, "comboBox9")).Items.Count;
                    for (int idx = 0; idx < count; idx++)
                    {
                        setPillars();
                        Click(f, "gimundungab");
                        ((ComboBox)C(f, "comboBox9")).SelectedIndex = idx;
                        Click(f, "gimundungab");
                        Dump(sb, "palja-pick" + idx, f);
                    }
                }
            }
            catch (Exception ex)
            {
                Exception e = ex.InnerException ?? ex;
                sb.AppendLine("EXCEPTION " + e.GetType().Name + ": " + e.Message);
                try { f.Dispose(); } catch { }
                f = NewForm1();
            }
            lock (threadErrors) { if (threadErrors.Length > 0) { sb.Append(threadErrors.ToString()); threadErrors.Clear(); } }
            if (++n % 100 == 0) Console.WriteLine(n + "/" + lines.Length);
        }
        File.WriteAllText(outFile, sb.ToString(), new UTF8Encoding(false));
        Console.WriteLine("done: " + outFile);
    }
}
