class Player{
  score: number = 0
  finishTime: number = 0
  accuracy: number = 0
  id = 0
  room: Room|null = null
  constructor(id: number, room: Room) {
    this.id = id
    this.room = room
  }
}