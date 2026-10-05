using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace WindowsFormsApp1
{
    /// <summary>한 개 궁(9궁 중 하나)의 계산 결과</summary>
    public class Goong
    {
        public int[] hongNum = new int[2];      //천반수 지반수
        public bool[] b_dong = new bool[4];     //사지
        public bool[] b_gan = new bool[4];      //사간
        public int[] yoo_age = new int[2];      //유년
        public int[] six_sin = new int[2];      //육신
        public int[] hongNumlvl = new int[2];   //홍국수 강약
        public int[] yooksam = new int[2];      //육의삼기
        public int eightmun;                    //팔문
        public int timeeightmun;                //시가    팔문
        public int eightgoe;                    //팔괴
        public int goosung;                     //구성
        public string eightjang;                //팔장
        public int cheoneul;                    //천을귀인
        public int cheonma;                     //천마
        public int ilrok;                       //일록
        public string eunsung;                  //12운성
        public string gongmang;                 //공망
        public string sinsal;                   //신살
        public string kyukkuk;                  //격국
        public int taeulgusung;                 //태을구성
        public string josang;                   //조객상문
        public string month_days;               //월국 날짜 (신수운)
        public string month_days_1;             //월국 날짜 - 네귀퉁이 (신수운)
    }

    /// <summary>10년 대운 한 칸 (표시는 시작 나이 + 간 + 지)</summary>
    public class DaeunItem
    {
        public int StartAge;
        public string Gan;
        public string Zi;
    }

    /// <summary>계산 결과 한 벌. 화면(Form)은 이것을 받아서 보여주기만 한다.</summary>
    public class SajuResult
    {
        public DateTime SolarDt;                // 양력 일시 (입력이 음력이면 변환된 값)
        public DateTime RealDt;                 // 서머타임, 동경시 등을 보정한 일시
        public bool LunarValid;                 // 양력으로 입력했을 때만 음력 값이 채워진다
        public bool Ly;                         // 윤달 여부
        public int LunarYear, LunarMonth, LunarDay;
        public DateTime[] Terms;                // 24절기
        public bool Direction;                  // 양둔(true), 음둔(false)
        public int[,] SjGanzi = new int[4, 2];  // 년월일시 간지
        public Goong[] Goong = new Goong[9];    // 9궁
        public int Eunboksu1, Eunboksu2;        // 은복수
        public int Sisunsoo;                    // 시순수
        public string BirthJeolgi;              // 생일 절기/상중하원/국 설명
        public DaeunItem[] Daeun;               // 10년 대운 9칸
    }

    public static partial class SajuEngine
    {
        /// <summary>양력 일시로 기문둔갑 전체를 계산한다.</summary>
        public static SajuResult Calculate(DateTime solarDt, int gender)
        {
            SajuResult r = new SajuResult();
            r.SolarDt = solarDt;
            int ly_y, ly_m, ly_d;
            r.LunarValid = true;
            ToLunarDate(solarDt, out r.Ly, out ly_y, out ly_m, out ly_d);    // 양력->음력 변환
            r.LunarYear = ly_y; r.LunarMonth = ly_m; r.LunarDay = ly_d;
            Compute(r, gender);
            return r;
        }

        /// <summary>음력(윤달 여부 포함) 일시로 기문둔갑 전체를 계산한다.</summary>
        public static SajuResult CalculateLunar(int year, int month, int day, int hour, int minute, bool leap, int gender)
        {
            SajuResult r = new SajuResult();
            r.Ly = leap;
            r.SolarDt = ToSolarDate(year, month, day, leap, hour, minute);   // 음력->양력 변환
            Compute(r, gender);
            return r;
        }

        /// <summary>
        /// 사주팔자(년월일시 간지)로 생년월일시 후보를 찾는다. (1924년 기준, 1984년 기준 각각 최대 1개)
        /// lastTerms 는 마지막으로 찾아본 해의 24절기이다.
        /// </summary>
        public static DateTime[] FindBirthDates(int[,] sjGanzi, out DateTime[] lastTerms)
        {
            lastTerms = null;
            List<DateTime> found = new List<DateTime>();
            foreach (int startYear in new int[] { 1924, 1984 })
            {
                DateTime birth;
                if (getdatefromsaju(sjGanzi, startYear, out birth, out lastTerms)) found.Add(birth);
            }
            return found.ToArray();
        }

        // 양력 일시(SolarDt)가 정해진 뒤의 계산 순서 전체
        private static void Compute(SajuResult r, int gender)
        {
            for (int i = 0; i < 9; i++) r.Goong[i] = new Goong();
            Goong[] goong = r.Goong;
            int[,] sjGanzi = r.SjGanzi;

            DateTime real_dt = dateAdjust(r.SolarDt);   // 서머타임 동경시 등 보정
            r.RealDt = real_dt;

            // 24절기 계산
            DateTime[] terms = get24Terms(real_dt);
            r.Terms = terms;

            //양둔, 음둔 계산
            bool direction = getDirection(real_dt, terms);
            r.Direction = direction;

            //년월일시 간지 계산
            ToSajuYear(real_dt, terms[2], out sjGanzi[0, 0], out sjGanzi[0, 1]);
            ToSajuMonth(real_dt, terms, sjGanzi[0, 0], out sjGanzi[1, 0], out sjGanzi[1, 1]);
            ToSajuDay(real_dt, out sjGanzi[2, 0], out sjGanzi[2, 1]);
            ToSajuTime(real_dt, sjGanzi[2, 0], out sjGanzi[3, 0], out sjGanzi[3, 1]);

            ComputeGoong(r, gender);
        }

        /// <summary>간지(SjGanzi), 절기, 방향이 정해진 뒤 9궁을 채운다. (사주팔자 직접 입력 때도 쓴다)</summary>
        public static void ComputeGoong(SajuResult r, int gender)
        {
            Goong[] goong = r.Goong;
            int[,] sjGanzi = r.SjGanzi;
            DateTime real_dt = r.RealDt;
            DateTime[] terms = r.Terms;
            bool direction = r.Direction;
            int eunboksu1, eunboksu2;

            //홍국수
            setHongNum(goong, sjGanzi, out eunboksu1, out eunboksu2);
            r.Eunboksu1 = eunboksu1; r.Eunboksu2 = eunboksu2;

            //동처 계산
            setDongcheo(goong, sjGanzi);

            //유년계산
            setYooAge(goong, eunboksu1, eunboksu2);

            //육신 계산
            setSixSin(goong, sjGanzi);

            //흥국수 강약
            setHonglvl(goong, sjGanzi[1, 1], real_dt);

            //육의삼기 붙이기
            string birthJeolgi;
            int sisunsoo = setYookSam(goong, sjGanzi, real_dt, terms, direction, out birthJeolgi);
            r.Sisunsoo = sisunsoo;
            r.BirthJeolgi = birthJeolgi;

            //사간 계산
            setfourGan(goong, sjGanzi);

            //조객 상문 붙이기
            setJoSang(goong, sjGanzi);

            //팔문 붙이기
            set8mun(goong, sjGanzi, direction);

            //시가팔문 붙이기
            settime8mun(goong, sjGanzi, direction);

            //팔괴 붙이기
            set8goe(goong);

            //구성 붙이기
            setGooSung(goong, sjGanzi, sisunsoo);

            //팔장 붙이기
            setEightjang(goong, sjGanzi, direction, sisunsoo);

            //천을, 천마 일록
            setCheonMaRok(goong, sjGanzi, direction);

            //12운성
            setEunsung(goong, sjGanzi);

            //공망
            setGongMang(goong, sjGanzi);

            //신살
            setSinsal(goong, sjGanzi);

            //격국
            setKyukkuk(goong, sjGanzi);

            //이사방위
            setIsabangui(goong, sjGanzi);

            //태을구성법
            setTaeulGusung(goong, sjGanzi, direction);

            //10년대운
            r.Daeun = calcDaeun(terms, sjGanzi, gender, real_dt);
        }

        /// <summary>10년 대운 9칸 계산</summary>
        public static DaeunItem[] calcDaeun(DateTime[] terms, int[,] sjGanzi, int gender, DateTime dt)
        {
            int i, j, k;
            double diff;
            DateTime[] terms1;
            DaeunItem[] items = new DaeunItem[9];

            for (i = 0; i < 12 && dt.CompareTo(terms[i * 2]) >= 0; i++) ;

            if ((sjGanzi[0, 0] % 2 == 1 && gender == 1) || (sjGanzi[0, 0] % 2 == 0 && gender == 0))
            {
                if (i == 12)
                {
                    terms1 = get24Terms(dt.AddYears(1));
                    diff = terms1[0].Date.Subtract(dt.Date).Days;
                    diff /= 3;
                    k = (int)Math.Round(diff);
                }
                else
                {
                    diff = terms[i * 2].Date.Subtract(dt.Date).Days;
                    diff /= 3;
                    k = (int)Math.Round(diff);
                }
                for (j = 0; j < 9; j++)
                    items[j] = new DaeunItem
                    {
                        StartAge = k + j * 10,
                        Gan = toGan((sjGanzi[1, 0] + j) % 10 + 1),
                        Zi = toZi((sjGanzi[1, 1] + j) % 12 + 1)
                    };
            }
            else
            {
                if (i == 0)
                {
                    terms1 = get24Terms(dt.AddYears(-1));
                    diff = dt.Date.Subtract(terms1[22].Date).Days;
                    diff /= 3;
                    k = (int)Math.Round(diff);
                }
                else
                {
                    diff = dt.Date.Subtract(terms[2 * (i - 1)].Date).Days;
                    diff /= 3;
                    k = (int)Math.Round(diff);
                }
                for (j = 0; j < 9; j++)
                    items[j] = new DaeunItem
                    {
                        StartAge = k + j * 10,
                        Gan = toGan((sjGanzi[1, 0] + 8 - j) % 10 + 1),
                        Zi = toZi((sjGanzi[1, 1] + 10 - j) % 12 + 1)
                    };
            }
            return items;
        }
        /// <summary>월국 - 한 달의 날짜(1일~말일)를 9궁에 나누어 붙인다. (신수운)</summary>
        /// <param name="solarInput">입력이 양력일 때(월은 textMonth 를 쓴다)</param>
        /// <param name="lunarInput">입력이 음력일 때(년/월은 pickerYear, pickerMonth 를 쓴다)</param>
        /// <param name="birthday">생일(일)</param>
        public static void setMonthDays(Goong[] goong, int[,] sjGanzi, bool direction, bool solarInput, bool lunarInput,
                                        int birthday, int pickerYear, int pickerMonth, string textMonth)
        {
            if (solarInput)
            {
                int month = int.Parse(textMonth);
                int endofmonth = 30;
                if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) endofmonth = 31;
                else if (month == 2) endofmonth = 29;
                spreadMonthDays(goong, sjGanzi, birthday, endofmonth);
            }
            if (lunarInput)
            {
                int year = pickerYear;
                int month = pickerMonth;

                KoreanLunisolarCalendar klc = new KoreanLunisolarCalendar();

                if (klc.GetMonthsInYear(year) > 12)
                {
                    int leapMonth = klc.GetLeapMonth(year);

                    if (month > leapMonth - 1) month++;
                }

                int endofmonth = klc.GetDaysInMonth(year, month);
                spreadMonthDays(goong, sjGanzi, birthday, endofmonth);
            }
        }

        // 양둔/음둔 모두 같은 식이라 하나로 합침
        private static void spreadMonthDays(Goong[] goong, int[,] sjGanzi, int birthday, int endofmonth)
        {
            int[] rr = { 4, 4, 9, 2, 2, 7, 6, 6, 1, 8, 8, 3 };
            int[] rr_day = { 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4 };

            int i = 0;
            while (sjGanzi[2, 1] != rr_day[i]) i++;
            int start = i;

            for (i = 1; i <= endofmonth; i++)
            {
                int k = (120 + (i - birthday) + start) % 12;
                if (new[] { 1, 4 }.Contains(k) || new[] { 6, 9 }.Contains(k))
                    goong[rr[k] - 1].month_days_1 += " " + i.ToString();
                else
                    goong[rr[k] - 1].month_days += " " + i.ToString();
            }
        }

        /// <summary>행년(신수운) 구궁 번호. age 는 만이 아닌 세는 나이</summary>
        public static int calcHyear(int gender, int age)
        {
            if (gender == 1)
            {
                int[] HyearRR = { 7, 6, 1, 8, 3, 4, 9, 2 };
                if (age == 1) return 9;
                return HyearRR[(age + 6) % 8];
            }
            else
            {
                int[] HyearRR = { 7, 2, 9, 4, 3, 8, 1, 6 };
                if (age == 1) return 1;
                return HyearRR[(age + 6) % 8];
            }
        }
    }
}
