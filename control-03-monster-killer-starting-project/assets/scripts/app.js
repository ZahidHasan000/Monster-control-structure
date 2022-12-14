/* const ATTACK_VALUE = 10;

const MONSTER_ATTACK_VALUE = 14;

const STRONG_ATTACK_VALUE = 17;
const chosenMAxLife = 100;

let currentMonsterHealth = chosenMAxLife;
let currentPlayerHealth = chosenMAxLife;

adjustHealthBars(chosenMAxLife);

function attackMonster(mode) {
  let maxDamage;

  if (mode === 'ATTACK') {
    maxDamage = ATTACK_VALUE;
  }
  else if (mode === 'STRONG_ATTACK') {
    maxDamage = STRONG_ATTACK_VALUE;
  }

  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  const PlayerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= PlayerDamage;
  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert('You Won !');
  }
  else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert('You Lost !');
  }
  else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    alert('You have a Draw !');
  }
}
function attackHandler() {
  attackMonster('ATTACK');
}
function strongAttackHandler() {
  attackMonster('STRONG_ATTACK');
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);    */



const ATTACK_VALUE = 10;

const MONSTER_ATTACK_VALUE = 14;

const STRONG_ATTACK_VALUE = 17;

const HEAL_VALUE = 20;

const MODE_ATTACK = 'ATTACK'; //MODE_ATTACK = 0
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';  //MODE_STRONG_ATTACaK = 1
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';


/* const enteredValue = prompt('Maximum life for you and the monster', '100');
let chosenMAxLife = parseInt(enteredValue);

if (isNaN(chosenMAxLife) || chosenMAxLife <= 0) {
  const chosenMAxLife = 100;
}  */

function getMaxLifeValues() {
  const enteredValue = prompt('Maximum life for you and the monster', '100');
  let parsedValue = parseInt(enteredValue);

  if (isNaN(parsedValue) || parsedValue <= 0) {
    throw { Message: 'Invalide user Input, not a number !' };
  }
  return parsedValue;
}

// let chosenMAxLife = getMaxLifeValues();

let chosenMAxLife;
try {
  chosenMAxLife = getMaxLifeValues();
} catch (error) {
  console.log(error);
  chosenMAxLife = 100;
  alert('you enterred something wrong, default value of 100 was used.');
  // throw error;
}


let battleLog = [];

let lastLoggedEntry;

let currentMonsterHealth = chosenMAxLife;
let currentPlayerHealth = chosenMAxLife;

let hasBonusLife = true;

adjustHealthBars(chosenMAxLife);

function writeToLog(ev, val, monsterHealth, playerHealth) {
  let logEntry = {
    event: ev,
    value: val,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth
  };

  switch (ev) {
    case LOG_EVENT_PLAYER_ATTACK:
      logEntry.target = 'MONSTER';
      break;
    case LOG_EVENT_PLAYER_STRONG_ATTACK:
      logEntry = {
        event: ev,
        value: val,
        target: 'MONSTER',
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
      };
      break;
    case LOG_EVENT_MONSTER_ATTACK:
      logEntry = {
        event: ev,
        value: val,
        target: 'PLAYER',
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
      };
      break;
    case LOG_EVENT_PLAYER_HEAL:
      logEntry = {
        event: ev,
        value: val,
        target: 'PLAYER',
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
      };
      break;
    case LOG_EVENT_GAME_OVER:
      logEntry = {
        event: ev,
        value: val,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
      };
      break;
    default:
      logEntry = {};
  }
  battleLog.push(logEntry);
}


/* if (ev === LOG_EVENT_PLAYER_ATTACK) {
  logEntry.target = 'MONSTER';
} else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
  logEntry = {
    event: ev,
    value: val,
    target: 'MONSTER',
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth
  };
} else if (ev === LOG_EVENT_MONSTER_ATTACK) {
  logEntry = {
    event: ev,
    value: val,
    target: 'PLAYER',
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth
  };
} else if (ev === LOG_EVENT_PLAYER_HEAL) {
  logEntry = {
    event: ev,
    value: val,
    target: 'PLAYER',
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth
  };
} else if (ev === LOG_EVENT_GAME_OVER) {
  logEntry = {
    event: ev,
    value: val,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth
  };

}
battleLog.push(logEntry);
}  */

function reset() {
  currentMonsterHealth = chosenMAxLife;
  currentPlayerHealth = chosenMAxLife
  resetGame(chosenMAxLife);
}

function endRound() {
  const initialPlayerHealth = currentPlayerHealth;
  const PlayerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= PlayerDamage;

  writeToLog(LOG_EVENT_MONSTER_ATTACK, PlayerDamage, currentMonsterHealth, currentPlayerHealth);

  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert('You would be dead but bonus life saved you !');
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert('You Won !');

    writeToLog(LOG_EVENT_GAME_OVER, 'PLAYER WON', currentMonsterHealth, currentPlayerHealth);
  }

  else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert('You Lost !');

    writeToLog(LOG_EVENT_GAME_OVER, 'MONSTER WON', currentMonsterHealth, currentPlayerHealth);
  }

  else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    alert('You have a Draw !');

    writeToLog(LOG_EVENT_GAME_OVER, 'A DRAW', currentMonsterHealth, currentPlayerHealth);
  }

  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    reset();
  }
}


function attackMonster(mode) {

  const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  const logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;

  /*let maxDamage;

  let logEvent;

  if (mode === MODE_ATTACK) {
    maxDamage = ATTACK_VALUE;

    logEvent = LOG_EVENT_PLAYER_ATTACK;
  }

  else if (mode === MODE_STRONG_ATTACK) {
    maxDamage = STRONG_ATTACK_VALUE;

    logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
  }  */

  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;

  writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);

  endRound()

}

function attackHandler() {
  attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
  attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler() {
  let healValue;
  if (currentPlayerHealth >= chosenMAxLife - HEAL_VALUE) {
    alert("You can't heal to more than you max initial health.");
    healValue = chosenMAxLife - currentPlayerHealth;
  }
  else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(HEAL_VALUE);

  currentPlayerHealth += healValue;

  writeToLog(LOG_EVENT_PLAYER_HEAL, healValue, currentMonsterHealth, currentPlayerHealth);

  endRound();
}

/* function printLogHandler() {
  console.log(battleLog);
} */

/* function printLogHandler() {
  for (let i = 0; i < 3; i++) {
    console.log('_______________');
  }
  // for (let i = 10; i > 0; i--) {
  //   console.log(i);
  // }
  for (let i = 10; i > 0;) {
    i--;
    console.log(i);
  }
  console.log(battleLog);
} */


function printLogHandler() {
  for (let i = 0; i < 3; i++) {
    console.log('_______________');
  }

  // let j = 3;
  /* let j = 0;
  do {
    console.log(j);
    j++;
  } while (j < 3); */

  let j = 0;
  outerWhile: do {
    console.log('outer', j);
    innerWhile: for (let k = 0; k < 5; k++) {
      if (k === 2) {
        break outerWhile;
        // continue outerWhile;  //Dangerous! => ifinite loop 
      }
      console.log('ineer', k);

    }
    j++;
  } while (j < 3);


  // for (let i = 0; i < battleLog.length; i++) {
  //   console.log(battleLog[i]);
  // }

  /* i = 0;
    for (const logEntry of battleLog) {
     console.log(logEntry);
     console.log(i);
     i++;
   }  */

  /* let i = 0;
  for (const logEntry of battleLog) {
    console.log(`#${i}`);
    for (const key in logEntry) {
      console.log(`${key} => ${logEntry[key]}`);
    }
    i++;
  }
}  */


  let i = 0;
  for (const logEntry of battleLog) {
    // if (!lastLoggedEntry || lastLoggedEntry < i) {
    if ((!lastLoggedEntry && lastLoggedEntry !== 0) || lastLoggedEntry < i) {
      console.log(`#${i}`);
      for (const key in logEntry) {
        console.log(`${key} => ${logEntry[key]}`);

      }
      lastLoggedEntry = i;
      break;
    }
    i++;

  }

}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', printLogHandler);
