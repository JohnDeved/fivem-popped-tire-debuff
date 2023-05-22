console.log("[popped-tire-debuff] Client Resource Started")

exports("poppedTireDebuff:setSettings", SetSettings)

const settings = {
  damageOnePop: 100,
  damageTwoPops: 0,
}

function SetSettings(s: Partial<typeof settings>) {
  Object.assign(settings, s)
}

on("gameEventTriggered", (name: "CEventNetworkEntityDamage" | "", args: string[]) => {
  // CEventNetworkEntityDamage target, attacker, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, damageType (93 = tire)
  if (name === "CEventNetworkEntityDamage") {
    const [target, attacker] = args
    const damageType = args[args.length - 1]

    // check if target is a vehicle
    if (GetEntityType(Number(target)) !== 2) return

    // check if attacker is the player
    if (Number(attacker) !== PlayerPedId()) return

    // check if damage type is tire
    if (Number(damageType) !== 93) return
    console.log("[popped-tire-debuff] tire damage detected")

    // check if vehicle has popped tire
    // check each weelid 0-5
    let poppedTires = 0
    for (let i = 0; i <= 5; i++) {
      if (IsVehicleTyreBurst(Number(target), i, false)) poppedTires++
    }

    console.log("[popped-tire-debuff] popped tires", poppedTires)

    // if 1 tire is popped, set vehicle engine health to 100
    // if more than 2 tires are popped, set vehicle engine health to 0

    if (poppedTires === 1) {
      console.log("[popped-tire-debuff] setting engine health to 100")
      SetVehicleEngineHealth(Number(target), settings.damageOnePop)
    }

    if (poppedTires >= 2) {
      console.log("[popped-tire-debuff] setting engine health to 0")
      SetVehicleEngineHealth(Number(target), settings.damageTwoPops)
      SetVehicleEngineOn(Number(target), false, true, true)
    }
  }
})