$("button").on('click', function() {
	$("#result").empty();
	checkStats();
});

function checkStats() {
	var charArray = [{}, {}, {}, {}];  // Holds all our character objects

	// Pulls all character data from page input fields, stores in charArray
	for (var i = 0; i < 4; i++) {
		charArray[i].index = i;
		charArray[i].name = $("#name_" + i).val();
		charArray[i].hp = parseInt($("#hp_" + i).val());
		charArray[i].baseAttack = charArray[i].currentAttack = parseInt($("#attack_" + i).val());
		charArray[i].counter = parseInt($("#counter_" + i).val());
		charArray[i].won = false;  // Boolean return for doBattle()
	}

	// For every character
	for (var i = 0; i < 4; i++) {
		var resultArr = [];  // Stores order of three successful fights
		
		checkAllEnemies([], charArray[i]);  // Check all fight order possibilities, stores in resultArr

		// Prints all orderings (or none found)
		if (resultArr.length > 0) {
			for (var j = 0; j < resultArr.length; j++) {
				$("#result").append(charArray[i].name + " can win by fighting in this order: "
					+ charArray[resultArr[j][0]].name + ", "
					+ charArray[resultArr[j][1]].name + ", "
					+ charArray[resultArr[j][2]].name + "<br/>");
			}
			if (resultArr.length == 6) {
				$("#result").append("<b>(" + charArray[i].name + " cannot lose!)</b><br/>");
			}
		}
		else {
			$("#result").append("<b>" + charArray[i].name + " cannot win.</b><br/>");
		}

		// Adds an extra line for the next character
		$("#result").append("<br/>");
	}

	// Recursive check for all winning battle orderings (permutations)
	function checkAllEnemies(indexArr, player) {
		debugger;
		var currentIndexArr = indexArr.slice();;  // Copies inderArr to new array

		// For all possible characters
		for (var i = 0; i < 4; i++) {

			// If the character is not the player and has not already been fought
			if ((i != player.index) && (currentIndexArr.indexOf(i) == -1)) {
				var currentPlayer = doBattle(player, charArray[i]);  // Fight!
				
				if (currentPlayer.won) {
					currentIndexArr.push(i);  // Add index of defeated enemy to currentIndexArr

					// If three enemies have been defeated
					if (currentIndexArr.length > 2) {
						resultArr.push(currentIndexArr);
					} // Else: recursive call to checkAllEnemies to fight next character
					else {
						checkAllEnemies(currentIndexArr, currentPlayer);
						
						// Execution returns here if previous check was unsuccessful
						// Copies the indexArr of the previous recursive call over the failed recursive call's indexArr
						currentIndexArr = indexArr.slice();
					}
				}
			}
		}
	}

	function doBattle(sourcePlayer, sourceEnemy) {
		debugger;
		var player = $.extend(true, {}, sourcePlayer);  // Copy player and enemy to temp objects
		var enemy = $.extend(true, {}, sourceEnemy);

		// Exits only when enemy or player is dead
		while (true) {
			enemy.hp -= player.currentAttack;
			player.currentAttack += player.baseAttack;

			// If enemy is dead, return true and prevent damage to player
			if (enemy.hp <= 0) {
				player.won = true;
				return player;
			}
			
			player.hp -= enemy.counter;
			
			if (player.hp <= 0) {
				player.won = false;
				return player;
			}
		}
	}
}