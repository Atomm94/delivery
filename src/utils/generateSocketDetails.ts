export default function(driverId: number): any {
  return {
    room: `Join:${driverId}`,
    event: `event:${driverId}`,
  }
}