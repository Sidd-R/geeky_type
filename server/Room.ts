class Room{
  players: Array<Player> = []
  status:"waiting"|"started" = "waiting"
  startTime: number = 0
  constructor(){
    this.startTime = new Date().getTime()
  }

  addPlayer(player:Player) {
    this.players.push(player)
  }

}