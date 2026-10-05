// 엔진 로직 비교 도구.
//   EngineCompare <옛프로그램.exe>
// 옛 프로그램(엔진 분리 전)의 Form1/Form4 계산 메서드를 리플렉션으로 "예전 버튼 순서 그대로" 호출한 결과와,
// 새 SajuEngine 의 결과를 수만 건 비교한다. 화면을 쓰지 않아서 빠르다.
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Windows.Forms;
using WindowsFormsApp1;

static class Program
{
    static Assembly asm;
    static Type tF1, tF4, tGoongOld, tGoongOld4;
    static Form f1, f4;
    const BindingFlags ANY = BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic;

    static object Call(object o, string name, params object[] args)
    {
        MethodInfo m = o.GetType().GetMethod(name, ANY);
        try { return m.Invoke(o, args); }
        catch (TargetInvocationException e) { System.Runtime.ExceptionServices.ExceptionDispatchInfo.Capture(e.InnerException).Throw(); return null; }
    }
    static void SetF(object o, string n, object v) { o.GetType().GetField(n, ANY).SetValue(o, v); }
    static object GetF(object o, string n) { return o.GetType().GetField(n, ANY).GetValue(o); }
    static Control C(Control root, string name) { return root.Controls.Find(name, true)[0]; }

    // ---------------------------------------------------------------- 옛 순서 그대로 계산 (예전 button1_Click)
    class OldOut
    {
        public int[,] sj = new int[4, 2];
        public object[] goong;
        public DateTime[] terms; public bool direction; public DateTime real_dt, solar_dt;
        public int e1, e2, sisunsoo; public string label56; public string[] daeun = new string[9];
        public bool ly; public int ly_y, ly_m, ly_d;
    }

    static OldOut OldCalc(Form f, Type tGoong, DateTime dt, int mode, int gender)
    {
        OldOut o = new OldOut();
        object[] goong = new object[9];
        Array garr = Array.CreateInstance(tGoong, 9);
        for (int i = 0; i < 9; i++) { object g = Activator.CreateInstance(tGoong); garr.SetValue(g, i); goong[i] = g; }
        SetF(f, "goong", garr);
        int[,] sj = new int[4, 2];
        SetF(f, "sjGanzi", sj);
        SetF(f, "dt", dt); SetF(f, "real_dt", dt); SetF(f, "gender", gender);

        DateTime solar;
        bool ly = false; int ly_y = 0, ly_m = 0, ly_d = 0;
        if (mode == 1)
        {
            solar = dt;
            object[] a = { dt, false, 0, 0, 0 };
            Call(f, "ToLunarDate", a);
            ly = (bool)a[1]; ly_y = (int)a[2]; ly_m = (int)a[3]; ly_d = (int)a[4];
        }
        else
        {
            ly = (mode == 3);
            solar = (DateTime)Call(f, "ToSolarDate", dt.Year, dt.Month, dt.Day, ly);
        }
        SetF(f, "solar_dt", solar);
        DateTime real = (DateTime)Call(f, "dateAdjust", solar);
        SetF(f, "real_dt", real);
        DateTime[] terms = (DateTime[])Call(f, "get24Terms", real);
        SetF(f, "terms", terms);
        bool direction = (bool)Call(f, "getDirection", real, terms);
        SetF(f, "direction", direction);

        object[] p = { real, terms[2], 0, 0 }; Call(f, "ToSajuYear", p); sj[0, 0] = (int)p[2]; sj[0, 1] = (int)p[3];
        p = new object[] { real, terms, sj[0, 0], 0, 0 }; Call(f, "ToSajuMonth", p); sj[1, 0] = (int)p[3]; sj[1, 1] = (int)p[4];
        p = new object[] { real, 0, 0 }; Call(f, "ToSajuDay", p); sj[2, 0] = (int)p[1]; sj[2, 1] = (int)p[2];
        p = new object[] { real, sj[2, 0], 0, 0 }; Call(f, "ToSajuTime", p); sj[3, 0] = (int)p[2]; sj[3, 1] = (int)p[3];

        p = new object[] { garr, sj, 0, 0 }; Call(f, "setHongNum", p); int e1 = (int)p[2], e2 = (int)p[3];
        Call(f, "setDongcheo", garr, sj);
        Call(f, "setYooAge", garr, e1, e2);
        Call(f, "setSixSin", garr, sj);
        Call(f, "setHonglvl", garr, sj[1, 1], real);
        int sisunsoo = (int)Call(f, "setYookSam", garr, sj, real, terms, direction);
        Call(f, "setfourGan", garr, sj);
        Call(f, "setJoSang", garr, sj);
        Call(f, "set8mun", garr, sj, direction);
        Call(f, "settime8mun", garr, sj, direction);
        Call(f, "set8goe", garr);
        Call(f, "setGooSung", garr, sj, sisunsoo);
        Call(f, "setEightjang", garr, sj, direction, sisunsoo);
        Call(f, "setCheonMaRok", garr, sj, direction);
        Call(f, "setEunsung", garr, sj);
        Call(f, "setGongMang", garr, sj);
        Call(f, "setSinsal", garr, sj);
        Call(f, "setKyukkuk", garr, sj);
        Call(f, "setIsabangui", garr, sj);
        Call(f, "setTaeulGusung", garr, sj, direction);
        if (tGoong == tGoongOld) Call(f, "set10Daeun", terms, sj, gender, real);

        o.sj = sj; o.goong = goong; o.terms = terms; o.direction = direction; o.real_dt = real; o.solar_dt = solar;
        o.e1 = e1; o.e2 = e2; o.sisunsoo = sisunsoo; o.ly = ly; o.ly_y = ly_y; o.ly_m = ly_m; o.ly_d = ly_d;
        o.label56 = C(f, "label56").Text;
        if (tGoong == tGoongOld)
        {
            Control gb = C(f, "groupBox4");
            for (int j = 0; j < 9; j++) o.daeun[j] = gb.Controls["label9" + (j + 1)].Text;
        }
        return o;
    }

    // ---------------------------------------------------------------- 비교용 문자열
    static string GoongStr(object g)
    {
        var sb = new StringBuilder();
        foreach (FieldInfo fi in g.GetType().GetFields(BindingFlags.Instance | BindingFlags.Public))
        {
            if (fi.Name.StartsWith("month_days")) continue;
            object v = fi.GetValue(g);
            sb.Append(fi.Name).Append('=');
            if (v is Array) sb.Append(string.Join(",", ((Array)v).Cast<object>().Select(x => Convert.ToString(x, CultureInfo.InvariantCulture))));
            else sb.Append(Convert.ToString(v, CultureInfo.InvariantCulture));
            sb.Append(';');
        }
        return sb.ToString();
    }
    static string Dt(DateTime d) { return d.ToString("yyyy-MM-dd HH:mm:ss.fff", CultureInfo.InvariantCulture); }

    static string OldStr(OldOut o, bool withDaeun)
    {
        var sb = new StringBuilder();
        sb.Append("solar=" + Dt(o.solar_dt) + "|real=" + Dt(o.real_dt) + "|dir=" + o.direction + "|e=" + o.e1 + "," + o.e2 + "|sis=" + o.sisunsoo + "|b=" + o.label56);
        sb.Append("|sj=" + string.Join(",", Enumerable.Range(0, 8).Select(i => o.sj[i / 2, i % 2])));
        sb.Append("|terms=" + string.Join(",", o.terms.Select(Dt)));
        for (int i = 0; i < 9; i++) sb.Append("|g" + i + ":" + GoongStr(o.goong[i]));
        if (withDaeun) sb.Append("|daeun=" + string.Join("/", o.daeun));
        return sb.ToString();
    }

    static string NewStr(SajuResult r, bool withDaeun)
    {
        var sb = new StringBuilder();
        sb.Append("solar=" + Dt(r.SolarDt) + "|real=" + Dt(r.RealDt) + "|dir=" + r.Direction + "|e=" + r.Eunboksu1 + "," + r.Eunboksu2 + "|sis=" + r.Sisunsoo + "|b=" + r.BirthJeolgi);
        sb.Append("|sj=" + string.Join(",", Enumerable.Range(0, 8).Select(i => r.SjGanzi[i / 2, i % 2])));
        sb.Append("|terms=" + string.Join(",", r.Terms.Select(Dt)));
        for (int i = 0; i < 9; i++) sb.Append("|g" + i + ":" + GoongStr(r.Goong[i]));
        if (withDaeun) sb.Append("|daeun=" + string.Join("/", r.Daeun.Select(d => d.StartAge + "\n" + d.Gan + "\n" + d.Zi)));
        return sb.ToString();
    }

    static int bad = 0, total = 0, intendedFix = 0;
    static void Report(string what, string input, string a, string b)
    {
        total++;
        if (a == b) return;
        bad++;
        if (bad <= 8)
        {
            Console.WriteLine("MISMATCH [" + what + "] " + input);
            int k = 0; while (k < a.Length && k < b.Length && a[k] == b[k]) k++;
            Console.WriteLine("  old: ..." + a.Substring(Math.Max(0, k - 40), Math.Min(120, a.Length - Math.Max(0, k - 40))));
            Console.WriteLine("  new: ..." + b.Substring(Math.Max(0, k - 40), Math.Min(120, b.Length - Math.Max(0, k - 40))));
        }
    }

    // ---------------------------------------------------------------- 시험
    static void TestCalc(Form f, Type tGoong, bool withDaeun, string label, List<Tuple<DateTime, int, int>> cases)
    {
        int before = total, badBefore = bad;
        foreach (var c in cases)
        {
            DateTime dt = c.Item1; int mode = c.Item2, gender = c.Item3;
            string input = Dt(dt) + " mode=" + mode + " g=" + gender;
            string so, sn;
            bool basicCrash = false;   // 옛 기본폼 toBirthJeolgi 가 12월 말에 범위 초과로 죽던 경우 (신수운 쪽 로직이 정답으로 합의됨)
            try { so = OldStr(OldCalc(f, tGoong, dt, mode, gender), withDaeun); }
            catch (Exception e)
            {
                so = "EXC";
                basicCrash = tGoong == tGoongOld && e is IndexOutOfRangeException && (e.StackTrace ?? "").Contains("toBirthJeolgi");
            }
            SajuResult r = null;
            try
            {
                r = mode == 1 ? SajuEngine.Calculate(dt, gender) : SajuEngine.CalculateLunar(dt.Year, dt.Month, dt.Day, dt.Hour, dt.Minute, mode == 3, gender);
                sn = NewStr(r, withDaeun);
            }
            catch (Exception e) { sn = "EXC"; }
            if (basicCrash && r != null)
            {
                // 옛 신수운 폼(Form4)이 같은 날짜에서 내는 결과와 새 엔진 결과가 같아야 한다
                intendedFix++;
                so = OldStr(OldCalc(f4, tGoongOld4, dt, mode, gender), false);
                sn = NewStr(r, false);
            }
            Report(label, input, so, sn);
        }
        Console.WriteLine(label + ": " + (total - before) + " cases, " + (bad - badBefore) + " mismatches");
    }

    [STAThread]
    static int Main(string[] a)
    {
        asm = Assembly.LoadFrom(System.IO.Path.GetFullPath(a[0]));
        tF1 = asm.GetType("WindowsFormsApp1.Form1", true);
        tF4 = asm.GetType("WindowsFormsApp1.Form4", true);
        tGoongOld = tF1.GetNestedType("Goong");
        tGoongOld4 = tF4.GetNestedType("Goong");
        f1 = (Form)Activator.CreateInstance(tF1);
        f4 = (Form)Activator.CreateInstance(tF4);
        var rnd = new Random(4242);
        DateTime lo = new DateTime(1901, 1, 1), hi = new DateTime(2050, 2, 9);

        // 1) 양력 입력: 무작위 + 24절기 경계(+-1분) + 서머타임/서울시 경계
        var solar = new List<Tuple<DateTime, int, int>>();
        for (int i = 0; i < 12000; i++)
        {
            DateTime d = lo.AddMinutes(rnd.NextDouble() * (hi - lo).TotalMinutes);
            solar.Add(Tuple.Create(new DateTime(d.Year, d.Month, d.Day, d.Hour, d.Minute, 0), 1, rnd.Next(2)));
        }
        for (int y = 1901; y <= 2049; y++)
        {
            DateTime[] t = SajuEngine.get24Terms(new DateTime(y, 6, 1));
            foreach (DateTime x in t)
                foreach (int off in new[] { -1, 0, 1 })
                {
                    DateTime d = x.AddMinutes(off);
                    if (d < lo || d > hi) continue;
                    solar.Add(Tuple.Create(new DateTime(d.Year, d.Month, d.Day, d.Hour, d.Minute, d.Second), 1, rnd.Next(2)));
                }
        }
        foreach (string[] r in new[] { new[] { "194806010000", "194809130000" }, new[] { "194904030000", "194909110000" }, new[] { "195004010000", "195009100000" }, new[] { "198705100200", "198710110300" }, new[] { "190802010000", "191112312359" }, new[] { "195403210000", "196108090000" } })
            foreach (string s in r)
                for (int off = -125; off <= 125; off += 5)
                {
                    DateTime d = DateTime.ParseExact(s, "yyyyMMddHHmm", CultureInfo.InvariantCulture).AddMinutes(off);
                    solar.Add(Tuple.Create(d, 1, rnd.Next(2)));
                }
        for (int y = 1901; y <= 2049; y += 1)       // 자시 경계
            foreach (int hm in new[] { 2259, 2300, 2329, 2330, 2359, 0, 29, 30, 59, 100 })
            {
                DateTime d = new DateTime(y, 1 + rnd.Next(12), 1 + rnd.Next(28), hm / 100, hm % 100, 0);
                solar.Add(Tuple.Create(d, 1, rnd.Next(2)));
            }
        TestCalc(f1, tGoongOld, true, "기본 폼 - 양력", solar);

        // 2) 음력 / 윤달 음력 입력
        var lunar = new List<Tuple<DateTime, int, int>>();
        int nl = 0, nleap = 0;
        while (nl < 4000 || nleap < 1500)
        {
            DateTime d = lo.AddMinutes(rnd.NextDouble() * (new DateTime(2049, 12, 31) - lo).TotalMinutes);
            bool ly; int y, m, dd;
            SajuEngine.ToLunarDate(d, out ly, out y, out m, out dd);
            DateTime pick;
            try { pick = new DateTime(y, m, dd, d.Hour, d.Minute, 0); } catch { continue; }
            if (y < 1901) continue;
            if (ly) { if (nleap >= 1500) continue; nleap++; } else { if (nl >= 4000) continue; nl++; }
            lunar.Add(Tuple.Create(pick, ly ? 3 : 2, rnd.Next(2)));
        }
        // 일부러 틀린 윤달 지정(윤달이 아닌 달을 윤달로) - 예외 동작도 같아야 한다
        for (int i = 0; i < 300; i++)
            lunar.Add(Tuple.Create(new DateTime(1901 + rnd.Next(149), 1 + rnd.Next(12), 1 + rnd.Next(28), rnd.Next(24), rnd.Next(60), 0), 2 + rnd.Next(2), rnd.Next(2)));
        TestCalc(f1, tGoongOld, true, "기본 폼 - 음력/윤달", lunar);

        // 3) 범위를 벗어난 날짜 (예외 동작이 같은지)
        var edge = new List<Tuple<DateTime, int, int>>();
        foreach (DateTime d in new[] { new DateTime(1900, 6, 1), new DateTime(1901, 1, 1), new DateTime(1901, 2, 18), new DateTime(2050, 2, 9, 23, 59, 0), new DateTime(2050, 2, 10), new DateTime(2051, 1, 1), new DateTime(2100, 1, 1), new DateTime(1800, 1, 1) })
            foreach (int g in new[] { 0, 1 }) edge.Add(Tuple.Create(d, 1, g));
        TestCalc(f1, tGoongOld, true, "범위 경계", edge);

        // 4) 신수운 폼(Form4) 의 계산도 새 엔진과 같은지 (월국/행년은 별도)
        TestCalc(f4, tGoongOld4, false, "신수운 폼 - 양력", solar.Take(4000).ToList());
        TestCalc(f4, tGoongOld4, false, "신수운 폼 - 음력", lunar.Take(2000).ToList());

        // 5) 음양력 변환 전 구간(하루 단위)
        {
            int before = total, badBefore = bad;
            for (DateTime d = lo; d < hi; d = d.AddDays(1))
            {
                string so, sn;
                try { object[] p = { d, false, 0, 0, 0 }; Call(f1, "ToLunarDate", p); so = p[1] + "," + p[2] + "," + p[3] + "," + p[4]; } catch { so = "EXC"; }
                try { bool ly; int y, m, dd; SajuEngine.ToLunarDate(d, out ly, out y, out m, out dd); sn = ly + "," + y + "," + m + "," + dd; } catch { sn = "EXC"; }
                Report("음력변환", Dt(d), so, sn);
            }
            Console.WriteLine("양력->음력 전 구간: " + (total - before) + " days, " + (bad - badBefore) + " mismatches");
        }

        // 6) 사주팔자 -> 생시 후보
        {
            int before = total, badBefore = bad;
            for (int i = 0; i < 1500; i++)
            {
                int[,] sj = new int[4, 2];
                if (i < 1100)
                {
                    DateTime d = new DateTime(1924, 1, 1).AddMinutes(rnd.NextDouble() * (new DateTime(2044, 1, 1) - new DateTime(1924, 1, 1)).TotalMinutes);
                    SajuResult r = SajuEngine.Calculate(d, 1);
                    sj = (int[,])r.SjGanzi.Clone();
                }
                else for (int k = 0; k < 4; k++) { sj[k, 0] = rnd.Next(1, 11); sj[k, 1] = rnd.Next(1, 13); }
                string so, sn;
                try
                {
                    SetF(f1, "sjGanzi", (int[,])sj.Clone());
                    var parts = new List<string>();
                    foreach (int sy in new[] { 1924, 1984 })
                    {
                        object[] p = { sy, DateTime.MinValue };
                        bool ok = (bool)Call(f1, "getdatefromsaju", p);
                        if (ok) parts.Add(Dt((DateTime)p[1]));
                    }
                    so = string.Join(";", parts) + "|terms=" + string.Join(",", ((DateTime[])GetF(f1, "terms")).Select(Dt));
                }
                catch { so = "EXC"; }
                try
                {
                    DateTime[] last;
                    DateTime[] found = SajuEngine.FindBirthDates((int[,])sj.Clone(), out last);
                    sn = string.Join(";", found.Select(Dt)) + "|terms=" + string.Join(",", last.Select(Dt));
                }
                catch { sn = "EXC"; }
                Report("사주->생시", string.Join(",", Enumerable.Range(0, 8).Select(k => sj[k / 2, k % 2])), so, sn);
            }
            Console.WriteLine("사주팔자->생시 후보: " + (total - before) + " cases, " + (bad - badBefore) + " mismatches");
        }

        // 7) 신수운 월국 (Form4.setMonthDays 옛 방식 vs 엔진)
        {
            int before = total, badBefore = bad;
            for (int i = 0; i < 4000; i++)
            {
                DateTime d = lo.AddMinutes(rnd.NextDouble() * (new DateTime(2049, 12, 31) - lo).TotalMinutes);
                d = new DateTime(d.Year, d.Month, d.Day, d.Hour, d.Minute, 0);
                int gender = rnd.Next(2);
                bool solarMode = (i % 2 == 0);
                // 월국은 사주 계산 후 쓰므로, 같은 날짜 계산 결과를 양쪽에 준다
                OldOut o = OldCalc(f4, tGoongOld4, d, 1, gender);
                SajuResult r = SajuEngine.Calculate(d, gender);
                int pickDay = 1 + rnd.Next(28), pickMonth = 1 + rnd.Next(12), pickYear = 1901 + rnd.Next(148);
                string textMonth = (1 + rnd.Next(12)).ToString();
                string so, sn;
                try
                {
                    // 라디오 버튼 이벤트 처리기가 f1(null) 을 건드려 예외가 날 수 있으나, 체크 상태는 이미 바뀐 뒤라 무시해도 된다
                    try { ((RadioButton)C(f4, "radioButton10")).Checked = solarMode; } catch { }
                    try { ((RadioButton)C(f4, "radioButton9")).Checked = !solarMode; } catch { }
                    ((DateTimePicker)C(f4, "dateTimePicker1")).Value = new DateTime(pickYear, pickMonth, pickDay, 12, 0, 0);
                    C(f4, "textBoxMonth").Text = textMonth;
                    object[] goongOld = o.goong;
                    Array garr = (Array)GetF(f4, "goong");
                    Call(f4, "setMonthDays", garr, o.sj, o.direction);
                    so = string.Join("|", Enumerable.Range(0, 9).Select(k => GetF(garr.GetValue(k), "month_days") + "/" + GetF(garr.GetValue(k), "month_days_1")));
                }
                catch { so = "EXC"; }
                try
                {
                    SajuEngine.setMonthDays(r.Goong, r.SjGanzi, r.Direction, solarMode, !solarMode, pickDay, pickYear, pickMonth, textMonth);
                    sn = string.Join("|", r.Goong.Select(g => g.month_days + "/" + g.month_days_1));
                }
                catch { sn = "EXC"; }
                Report("월국", Dt(d) + " solar=" + solarMode + " pick=" + pickYear + "-" + pickMonth + "-" + pickDay + " tm=" + textMonth, so, sn);
            }
            Console.WriteLine("신수운 월국: " + (total - before) + " cases, " + (bad - badBefore) + " mismatches");
        }

        Console.WriteLine("(기본폼이 12월 말 생일에서 오류나던 것을 신수운 쪽 로직으로 통일한 경우: " + intendedFix + "건, 신수운 폼 결과와 일치 확인)");
        Console.WriteLine("==== TOTAL " + total + " cases, " + bad + " mismatches ====");
        return bad == 0 ? 0 : 2;
    }
}
