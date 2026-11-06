// Minimal types for the parts of suncalc the village uses.
declare module 'suncalc' {
  interface SunTimes {
    sunrise: Date;
    sunset: Date;
    solarNoon: Date;
    dawn: Date;
    dusk: Date;
    goldenHour: Date;
    goldenHourEnd: Date;
    night: Date;
    nightEnd: Date;
  }
  interface SunPosition {
    altitude: number; // radians
    azimuth: number;
  }
  const SunCalc: {
    getTimes(date: Date, lat: number, lng: number): SunTimes;
    getPosition(date: Date, lat: number, lng: number): SunPosition;
  };
  export default SunCalc;
}
