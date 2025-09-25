// lib/generateSlots.js
export function generateSlots(startTime, endTime, duration) {
  const slots = [];

  let [startHour, startMin] = startTime.split(":").map(Number);
  let [endHour, endMin] = endTime.split(":").map(Number);

  let start = new Date(2000, 0, 1, startHour, startMin);
  let end = new Date(2000, 0, 1, endHour, endMin);

  while (start < end) {
    let slotStart = new Date(start);
    let slotEnd = new Date(start.getTime() + duration * 60000);

    if (slotEnd <= end) {
      slots.push({
        startTime: slotStart.toTimeString().slice(0, 5),
        endTime: slotEnd.toTimeString().slice(0, 5),
        isBooked: false,
      });
    }
    start = slotEnd;
  }

  return slots;
}
