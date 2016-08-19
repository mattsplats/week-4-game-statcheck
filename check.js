$("button").on('click', function() {
	$("#result").empty();
	checkStats();
});

function checkStats() {
	var charArray = [{}, {}, {}, {}];

	for (var i = 0; i < 4; i++) {
		charArray[i].index = i;
		charArray[i].name = $("#name_" + i).val();
		charArray[i].hp = parseInt($("#hp_" + i).val());
		charArray[i].baseAttack = charArray[i].currentAttack = parseInt($("#attack_" + i).val());
		charArray[i].counter = parseInt($("#counter_" + i).val());
		charArray[i].won = false;
	}

	for (var i = 0; i < 4; i++) {
		var resultArr = [];
		
		checkAllEnemies([], charArray[i]);

		// debugger;
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

		$("#result").append("<br/>");
	}

	function checkAllEnemies(indexArr, player) {
		debugger;
		var currentIndexArr = indexArr.slice();;

		for (var i = 0; i < 4; i++) {
			if ((i != player.index) && (currentIndexArr.indexOf(i) == -1)) {
				var currentPlayer = doBattle(player, charArray[i]);
				if (currentPlayer.won) {
					currentIndexArr.push(i);
					if (currentIndexArr.length > 2) {
						resultArr.push(currentIndexArr);
					}
					else {
						checkAllEnemies(currentIndexArr, currentPlayer);
						currentIndexArr = indexArr.slice();
					}
				}
			}
		}
	}

	function doBattle(sourcePlayer, sourceEnemy) {
		debugger;
		var player = $.extend(true, {}, sourcePlayer);
		var enemy = $.extend(true, {}, sourceEnemy);

		while (true) {
			enemy.hp -= player.currentAttack;
			player.currentAttack += player.baseAttack;

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