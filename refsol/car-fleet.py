def carFleet(target, position, speed):
    pairs = sorted(zip(position, speed), reverse=True)
    fleets = 0
    cur_time = 0.0
    for pos, spd in pairs:
        time = (target - pos) / spd
        if time > cur_time:
            fleets += 1
            cur_time = time
    return fleets
