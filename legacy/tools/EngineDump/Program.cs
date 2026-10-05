// SajuEngine 의 정답지(JSON) 생성기. TypeScript 이식본이 같은 입력에서 같은 결과를 내는지 비교하는 데 쓴다.
//   EngineDump cases  <출력.json> [개수]   : 계산 결과 정답지
//   EngineDump lunar  <출력.json>          : 음력 달력표 (1901~2049년) - KoreanLunisolarCalendar 대체용
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Text;
using WindowsFormsApp1;

static class Program
{
    static string Q(string s)
    {
        var sb = new StringBuilder("\"");
        foreach (char c in s ?? "")
        {
            if (c == '"') sb.Append("\\\""); else if (c == '\\') sb.Append("\\\\");
            else if (c == '\n') sb.Append("\\n"); else if (c == '\r') sb.Append("\\r");
            else if (c < 32) sb.Append("\\u" + ((int)c).ToString("x4"));
            else sb.Append(c);
        }
        return sb.Append('"').ToString();
    }
    static string D(DateTime d) { return Q(d.ToString("yyyy-MM-ddTHH:mm:ss.fff", CultureInfo.InvariantCulture)); }
    static string B(bool b) { return b ? "true" : "false"; }
    static string Arr<T>(IEnumerable<T> xs, Func<T, string> f) { var l = new List<string>(); foreach (T x in xs) l.Add(f(x)); return "[" + string.Join(",", l) + "]"; }

    static string GoongJson(Goong g)
    {
        return "{" +
            "\"hongNum\":" + Arr(g.hongNum, x => x.ToString()) +
            ",\"b_dong\":" + Arr(g.b_dong, B) +
            ",\"b_gan\":" + Arr(g.b_gan, B) +
            ",\"yoo_age\":" + Arr(g.yoo_age, x => x.ToString()) +
            ",\"six_sin\":" + Arr(g.six_sin, x => x.ToString()) +
            ",\"hongNumlvl\":" + Arr(g.hongNumlvl, x => x.ToString()) +
            ",\"yooksam\":" + Arr(g.yooksam, x => x.ToString()) +
            ",\"eightmun\":" + g.eightmun +
            ",\"timeeightmun\":" + g.timeeightmun +
            ",\"eightgoe\":" + g.eightgoe +
            ",\"goosung\":" + g.goosung +
            ",\"eightjang\":" + Q(g.eightjang) +
            ",\"cheoneul\":" + g.cheoneul +
            ",\"cheonma\":" + g.cheonma +
            ",\"ilrok\":" + g.ilrok +
            ",\"eunsung\":" + Q(g.eunsung) +
            ",\"gongmang\":" + Q(g.gongmang) +
            ",\"sinsal\":" + Q(g.sinsal) +
            ",\"kyukkuk\":" + Q(g.kyukkuk) +
            ",\"taeulgusung\":" + g.taeulgusung +
            ",\"josang\":" + Q(g.josang) + "}";
    }

    static string ResultJson(SajuResult r)
    {
        var sj = new List<string>();
        for (int i = 0; i < 4; i++) sj.Add("[" + r.SjGanzi[i, 0] + "," + r.SjGanzi[i, 1] + "]");
        return "{" +
            "\"solarDt\":" + D(r.SolarDt) +
            ",\"realDt\":" + D(r.RealDt) +
            ",\"lunarValid\":" + B(r.LunarValid) +
            ",\"ly\":" + B(r.Ly) +
            ",\"lunar\":[" + r.LunarYear + "," + r.LunarMonth + "," + r.LunarDay + "]" +
            ",\"terms\":" + Arr(r.Terms, D) +
            ",\"direction\":" + B(r.Direction) +
            ",\"sjGanzi\":[" + string.Join(",", sj) + "]" +
            ",\"eunboksu\":[" + r.Eunboksu1 + "," + r.Eunboksu2 + "]" +
            ",\"sisunsoo\":" + r.Sisunsoo +
            ",\"birthJeolgi\":" + Q(r.BirthJeolgi) +
            ",\"daeun\":" + Arr(r.Daeun, d => "{\"age\":" + d.StartAge + ",\"gan\":" + Q(d.Gan) + ",\"zi\":" + Q(d.Zi) + "}") +
            ",\"goong\":" + Arr(r.Goong, GoongJson) + "}";
    }

    static void Cases(string outFile, int count, bool edge = false)
    {
        var rnd = new Random(77);
        var items = new List<string>();
        DateTime lo = new DateTime(1901, 1, 1), hi = new DateTime(2050, 2, 9);
        for (int i = 0; i < count; i++)
        {
            DateTime dt = lo.AddMinutes(rnd.NextDouble() * (hi - lo).TotalMinutes);
            dt = new DateTime(dt.Year, dt.Month, dt.Day, dt.Hour, dt.Minute, 0);
            if (edge)   // 24절기 시각 바로 앞뒤 (+-1분) 와 자시/서머타임 경계
            {
                DateTime[] ts = SajuEngine.get24Terms(new DateTime(1901 + rnd.Next(149), 6, 1));
                DateTime t = ts[rnd.Next(24)];
                dt = new DateTime(t.Year, t.Month, t.Day, t.Hour, t.Minute, 0).AddMinutes(rnd.Next(-2, 3));
                if (dt > hi || dt < lo) { i--; continue; }
            }
            int gender = rnd.Next(2);
            string kind, input;
            SajuResult r = null; bool err = false;
            int mode = i % 4;     // 0,1: 양력  2: 음력  3: 윤달 음력(가능하면)
            if (mode < 2)
            {
                kind = "solar";
                input = "{\"kind\":\"solar\",\"y\":" + dt.Year + ",\"m\":" + dt.Month + ",\"d\":" + dt.Day + ",\"h\":" + dt.Hour + ",\"mi\":" + dt.Minute + ",\"gender\":" + gender + "}";
                try { r = SajuEngine.Calculate(dt, gender); } catch { err = true; }
            }
            else
            {
                bool ly; int y, m, d;
                try { SajuEngine.ToLunarDate(dt, out ly, out y, out m, out d); } catch { i--; continue; }
                if (y < 1901 || y > 2049) { i--; continue; }
                bool leap = (mode == 3) && ly;
                if (mode == 3 && !ly) { i--; continue; }
                kind = leap ? "lunarLeap" : "lunar";
                input = "{\"kind\":\"" + kind + "\",\"y\":" + y + ",\"m\":" + m + ",\"d\":" + d + ",\"h\":" + dt.Hour + ",\"mi\":" + dt.Minute + ",\"leap\":" + B(leap) + ",\"gender\":" + gender + "}";
                try { r = SajuEngine.CalculateLunar(y, m, d, dt.Hour, dt.Minute, leap, gender); } catch { err = true; }
            }
            items.Add("{\"in\":" + input + ",\"out\":" + (err ? "null" : ResultJson(r)) + "}");
        }
        File.WriteAllText(outFile, "[\n" + string.Join(",\n", items) + "\n]\n", new UTF8Encoding(false));
        Console.WriteLine("cases: " + items.Count);
    }

    // 사주팔자 -> 생시 후보
    static void Palja(string outFile, int count)
    {
        var rnd = new Random(78);
        var items = new List<string>();
        for (int i = 0; i < count; i++)
        {
            SajuResult src = SajuEngine.Calculate(new DateTime(1924, 1, 1).AddMinutes(rnd.NextDouble() * (new DateTime(2044, 1, 1) - new DateTime(1924, 1, 1)).TotalMinutes), 1);
            int[,] sj = src.SjGanzi;
            DateTime[] last;
            DateTime[] found = SajuEngine.FindBirthDates(sj, out last);
            var s = new List<string>();
            for (int a = 0; a < 4; a++) s.Add("[" + sj[a, 0] + "," + sj[a, 1] + "]");
            items.Add("{\"sjGanzi\":[" + string.Join(",", s) + "],\"found\":" + Arr(found, D) + ",\"lastTerms\":" + Arr(last, D) + "}");
        }
        File.WriteAllText(outFile, "[\n" + string.Join(",\n", items) + "\n]\n", new UTF8Encoding(false));
        Console.WriteLine("palja: " + items.Count);
    }

    // 음력 달력표: 연도별 윤달 위치, 월별 일수, 설날(음력 1월 1일)의 양력 날짜
    static void Lunar(string outFile)
    {
        var klc = new KoreanLunisolarCalendar();
        var rows = new List<string>();
        for (int y = 1850; y <= 2050; y++)
        {
            try
            {
                int months = klc.GetMonthsInYear(y);
                int leap = klc.GetLeapMonth(y);      // 0 이면 윤달 없음 (.NET 의 달 번호 기준)
                var days = new List<int>();
                for (int m = 1; m <= months; m++) days.Add(klc.GetDaysInMonth(y, m));
                DateTime ny = klc.ToDateTime(y, 1, 1, 0, 0, 0, 0);
                rows.Add("{\"year\":" + y + ",\"months\":" + months + ",\"leapMonth\":" + leap + ",\"days\":" + Arr(days, x => x.ToString()) + ",\"newYear\":" + Q(ny.ToString("yyyy-MM-dd")) + "}");
            }
            catch { }
        }
        File.WriteAllText(outFile, "[\n" + string.Join(",\n", rows) + "\n]\n", new UTF8Encoding(false));
        Console.WriteLine("lunar years: " + rows.Count);
    }

    // 양력 날짜별 음력 변환 결과 (전 구간). TS 이식본과 줄 단위로 비교한다.
    static void LunarDays(string outFile)
    {
        var sb = new StringBuilder();
        for (DateTime d = new DateTime(1901, 1, 1); d <= new DateTime(2050, 2, 10); d = d.AddDays(1))
        {
            bool ly; int y, m, dd;
            SajuEngine.ToLunarDate(d, out ly, out y, out m, out dd);
            sb.Append(d.ToString("yyyy-MM-dd")).Append(' ').Append(ly ? 1 : 0).Append(' ').Append(y).Append(' ').Append(m).Append(' ').Append(dd).Append((char)10);
        }
        File.WriteAllText(outFile, sb.ToString(), new UTF8Encoding(false));
        Console.WriteLine("days: " + (sb.Length > 0 ? "ok" : "empty"));
    }

    // 신수운 월국 정답지
    static void MonthDays(string outFile, int count)
    {
        var rnd = new Random(79);
        var items = new List<string>();
        for (int i = 0; i < count; i++)
        {
            DateTime d = new DateTime(1901, 1, 1).AddDays(rnd.Next(54000));
            d = new DateTime(d.Year, d.Month, d.Day, rnd.Next(24), rnd.Next(60), 0);
            SajuResult r = SajuEngine.Calculate(d, 1);
            bool solarMode = i % 2 == 0;
            int pickDay = 1 + rnd.Next(28), pickMonth = 1 + rnd.Next(12), pickYear = 1901 + rnd.Next(148);
            string textMonth = (1 + rnd.Next(12)).ToString();
            string outJson;
            try
            {
                SajuEngine.setMonthDays(r.Goong, r.SjGanzi, r.Direction, solarMode, !solarMode, pickDay, pickYear, pickMonth, textMonth);
                outJson = Arr(r.Goong, g => "[" + Q(g.month_days) + "," + Q(g.month_days_1) + "]");
            }
            catch { outJson = "null"; }
            var sj = new List<string>();
            for (int a = 0; a < 4; a++) sj.Add("[" + r.SjGanzi[a, 0] + "," + r.SjGanzi[a, 1] + "]");
            items.Add("{\"date\":" + D(d) + ",\"solar\":" + B(solarMode) + ",\"pick\":[" + pickYear + "," + pickMonth + "," + pickDay + "],\"textMonth\":" + Q(textMonth) + ",\"out\":" + outJson + "}");
        }
        File.WriteAllText(outFile, "[" + (char)10 + string.Join("," + (char)10, items) + (char)10 + "]" + (char)10, new UTF8Encoding(false));
        Console.WriteLine("monthdays: " + items.Count);
    }

    static int Main(string[] a)
    {
        if (a.Length < 2) { Console.WriteLine("usage: cases|palja|lunar out.json [count]"); return 1; }
        int n = a.Length > 2 ? int.Parse(a[2]) : 1500;
        if (a[0] == "cases") Cases(a[1], n, a.Length > 3 && a[3] == "edge");
        else if (a[0] == "palja") Palja(a[1], n);
        else if (a[0] == "lunar") Lunar(a[1]);
        else if (a[0] == "monthdays") MonthDays(a[1], n);
        else if (a[0] == "lunardays") LunarDays(a[1]);
        return 0;
    }
}
