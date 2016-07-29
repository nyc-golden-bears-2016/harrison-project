// Player

var Player = function Player(){
	this.pos_x = 0;
	this.pos_y = 0;
}

Player.prototype.moveLeft = function(field){
	if( (this.pos_x - 1 >= 0) && (field.grid[(this.pos_x - 1)][this.pos_y] !== "wall") ) {
		this.pos_x--;
		return true;
	}
}
Player.prototype.moveRight = function(field){
	if( (field.grid[(this.pos_x + 1)][this.pos_y] !== "wall") ){
		this.pos_x++;
		return true;
	}
}
Player.prototype.moveUp = function(field){
	if( (this.pos_y - 1 >= 0) && (field.grid[this.pos_x][this.pos_y - 1] !== "wall") ){
		this.pos_y--;
		return true;
	}
}
Player.prototype.moveDown = function(field){
	if( (field.grid[this.pos_x][this.pos_y + 1] !== "wall") ){
		this.pos_y++;
		return true;
	}
}

Player.prototype.move = function(keyCode){
	if (keyCode === 40){
		if (p1.moveLeft(field) ){
			return true;
		}
	}
	else if (keyCode === 38){
		if (p1.moveRight(field) ){
			return true;
		}
	}
	else if (keyCode === 39){
		if (p1.moveUp(field) ){
			return true;
		}
	}
	else if (keyCode === 37){
		if (p1.moveDown(field) ){
			return true;
		}
	}
	return false;
}

var p1 = new Player();


// Field

var Field = function Field(x_dimension, y_dimension){
	this.y_dimension = y_dimension;
	this.x_dimension = x_dimension;
	this.fieldElements = "";
	this.grid = new Array(x_dimension);
	for (var i = x_dimension - 1; i >= 0; i--) {
		this.grid[i] = [];
		this.grid[i][y_dimension - 1] = "wall";
	}
	for (var y = y_dimension - 1; y >= 0; y--) {
		this.grid[x_dimension - 1][y] = "wall";
	}
}

Field.prototype.checkPlayerOrNpc = function(player, npc, cur_field, x, y){
	if ( x === player.pos_x && y === player.pos_y ){
		cur_field.fieldElements += '<div class="p1"></div>';
		return true
	} else{
		for (var i = npc.length - 1; i >= 0; i--) {
			if ( x === npc[i].pos_x && y === npc[i].pos_y ){
				cur_field.fieldElements += '<div class="npc"></div>';
				return true;
			}
		}
	}
	return false;
}

Field.prototype.drawField = function(player, npc){
	this.fieldElements = "";
	for (var x = this.grid.length - 1; x >= 0; x--) {
		for (var y = this.grid[x].length - 1; y >= 0; y--) {
			if (this.checkPlayerOrNpc(player, npc, this, x, y)){}
			else {
				this.fieldElements += ('<div class="' + String(this.grid[x][y]) + '"></div>');
			}
		}
		this.fieldElements += '<div class="row_end"></div>'
	}
}

Field.prototype.checkMoemon = function(player, cur_field){
	var moemonCode = Math.floor(Math.random() * 15);
	if ( moemonCode >= 0 && moemonCode <= 3 )
	{
		return "Konata";
	} else if ( moemonCode >= 4 && moemonCode <= 6 )
	{
		return "Homura";
	} else if ( moemonCode >= 7 && moemonCode <= 10 )
	{
		return "Nanoha";
	} else if ( moemonCode >= 11 && moemonCode <= 13 )
	{
		return "Mahoro";
	}
	else {
		return "HomuShotgun";
	}
}

Field.prototype.checkEncounter = function(player, cur_field){
	if (Math.floor(Math.random() * 20) === 19)
	{
		return this.checkMoemon(player, cur_field);
	} else {
		return false;
	}
}

var field = new Field(20,30);
console.log(field.grid.length);
console.log(field.grid[1].length);
field.grid[15][15] = "wall";

// Npc

var Npc = function Npc(){
	this.name = "unknown";
	this.twitterAccount = "unknown";
	this.moemon = "DatBoi";
	this.pos_x = 1;
	this.pos_y = 1;
}

Npc.prototype.init = function(name){
	if (name === "Trump"){
		this.name = "Trump";
		this.twitterAccount = "realDonaldTrump";
		this.moemon = "KonaWaifu";
		this.pos_x = 10;
		this.pos_y = 5;
	} else if (name === "SEGA"){
		this.name = "SEGA";
		this.twitterAccount = "SEGA";
		this.moemon = "Neptune";
		this.pos_x = 15;
		this.pos_y = 6;
	}
}

var trump = new Npc();
trump.init("Trump");
var sega = new Npc();
sega.init("SEGA");
var the_npcs = [trump, sega];

// Battle

var Battle = function Battle(){
	this.battleElements = "";
	this.topPos = 0;
	this.bottomPos = 500;
	this.jitterEffect = 3;
	this.jitterApply = 0;
	this.jitterTimer = 8;
}

Battle.prototype.battleReady = function(){
	if ( (this.topPos === 500) && (this.bottomPos === 0) ){
		return true;
	} else {
		return false;
	}
}

Battle.prototype.drawBattle = function(player, opponent){
	this.battleElements = "";
	this.jitterTimer--;
	if ( this.jitterTimer == 0) {
		this.jitterEffect *= -1;
		this.jitterApply = this.jitterEffect;
		this.jitterTimer = 8;
	}
	if (this.battleReady()){
		for (var i = opponent.curHP - 1; i >= 0; i-= 3) {
			this.battleElements += '<div class="opponent_health"></div>';
		}
		this.battleElements += '<div class="top ' + opponent.name + '" style="left: ' + (this.topPos + this.jitterEffect) + 'px;"></div><div class="divider"></div><div class="bottom" style="left: ' + (this.bottomPos + (this.jitterEffect*-1) ) + 'px;"></div><div class="health">HP: ' + opponent.curHP + '</div>';
		for (var i = player.curHP - 1; i >= 0; i-= 3) {
			this.battleElements += '<div class="player_health"></div>';
		}
	} else{
		this.battleElements += '<div class="top ' + opponent.name + '" style="left: ' + this.topPos + 'px;"></div><div class="divider"></div><div class="bottom" style="left: ' + this.bottomPos + 'px;"></div>';
	}
	this.jitterApply = 0;
}


Battle.prototype.positionElements = function(){
	this.topPos+= 10;
	this.bottomPos-= 10;
	if (this.bottomPos < 0){
		this.bottomPos = 0;
	}
	if (this.topPos > 500){
		this.bottomPos = 500;
	}
}

Battle.prototype.cleanUp = function(){
	this.topPos = 0;
	this.bottomPos = 500;
}

var battle = new Battle();


// Opponent

var Opponent = function Opponent(){
	this.name = "Missing No."
	this.maxHP = 10;
	this.curHP = 10;
	this.power = 1;
	this.attackDelay = 10;
	this.attackState = 0;
}

Opponent.prototype.isDead = function(){
	if (this.curHP < 1){
		return true;
	} else {
		return false;
	}
}

Opponent.prototype.attack = function(player){
	if (this.attackState >= this.attackDelay){
		player.curHP -= this.power;
		this.attackState = 0;
	} else {
		this.attackState++;
	}
}

var opponent = new Opponent();
opponent.name = "Homura";

// PlayerChar

var PlayerChar = function PlayerChar(){
	this.maxHP = 100;
	this.curHP = 100;
	this.power = 1;
}

PlayerChar.prototype.attack = function(opponent){
	opponent.curHP -= this.power;
}

PlayerChar.prototype.isDead = function(){
	if (this.curHP < 1){
		return true;
	} else {
		return false;
	}
}

var pChar = new PlayerChar();

// Game

var Game = function Game(){
	this.inField = false;
	this.inBattle = false;
	this.inDialogue = false;
}

Game.prototype.doBattle = function(opponent){
	this.inBattle = true;
	this.inField = false;
	this.inDialogue = false;

	if ( opponent.name === "DatBoi" ){
		opponent.maxHP = opponent.curHP = 20;
		opponent.power = 2;
	} else if ( opponent.name === "Homura"){
		opponent.maxHP = opponent.curHP = 25;
		opponent.power = 1;
		opponent.attackDelay = 8;
	} else if ( opponent.name === "Konata"){
		opponent.maxHP = opponent.curHP = 15;
		opponent.power = 1;
		opponent.attackDelay = 13;
	} else if ( opponent.name === "Nanoha"){
		opponent.maxHP = opponent.curHP = 20;
		opponent.power = 2;
		opponent.attackDelay = 10;
	} else if ( opponent.name === "Mahoro"){
		opponent.maxHP = opponent.curHP = 30;
		opponent.power = 2;
		opponent.attackDelay = 13;
	} else if ( opponent.name === "KonaWaifu"){
		opponent.maxHP = opponent.curHP = 120;
		opponent.power = 4;
		opponent.attackDelay = 5;
	} else if ( opponent.name === "HomuShotgun"){
		opponent.maxHP = opponent.curHP = 50;
		opponent.power = 3;
		opponent.attackDelay = 6;
	}
	else {
		opponent.maxHP = opponent.curHP = 20;
		opponent.power = 2;
	}
}

Game.prototype.doField = function(){
	this.inBattle = false;
	this.inField = true;
	this.inDialogue = false;
}

Game.prototype.doDialogue = function(npc_name){
	this.inBattle = false;
	this.inField = false;
	this.inDialogue = npc_name;
}

Game.prototype.checkNpc = function(player, npcs){
	for (var i = npcs.length - 1; i >= 0; i--) {
		if (npcs[i].pos_x === player.pos_x && npcs[i].pos_y === player.pos_y){
			this.doDialogue(npcs[i].name);
		}
	};
}

var game = new Game();
game.doField();

// Dialogue

var Dialogue = function Dialogue(){
	this.dialogueElements = "";
	this.message = "";
	this.moemon = "";
	this.npc_name = "";
	this.npc_image = "";
	this.challenge_message = "";
}


Dialogue.prototype.fetchNpcInfo = function(npc){
	this.npc_name = npc.name;
	this.moemon = npc.moemon;
	var that = this;
	$.ajax({
		method: "POST",
		url: '/tweets',
		data: {username: npc.twitterAccount}
	}).done(function(npc_data){
		var npc_info = JSON.parse(npc_data);
		that.message = npc_info.dialogue;
		that.npc_image = npc_info.portrait.scheme + "://" + npc_info.portrait.host + npc_info.portrait.path;
	});
}

Dialogue.prototype.init = function(npc_name){
	if (npc_name === "Trump"){
		this.moemon = "KonaWaifu";
		this.challenge_message = " \"With the glorious power of my waifu I will destroy you and rule this world.\"";
	}
}

Dialogue.prototype.drawDialogue = function(){
	this.dialogueElements = "";
	this.dialogueElements += '<p class="npc_name">' + this.npc_name + '</p><div style="width: 50px; height: 50px; display: block;"><img style="position: fixed; left: 100px;" src="' + this.npc_image + '"height="50" width="50"></img></div><p class="dialogue">' + (this.message + this.challenge_message) + '</p><p class="challenge">Will you engage in a moemon battle with Trump?</p>';
}

var dialogue = new Dialogue();
dialogue.init("Trump");
dialogue.fetchNpcInfo(trump);

$(document).ready(function(){
	field.drawField(p1, the_npcs);
	$('body').html(field.fieldElements);
	var displayPosition = function(){
		game.checkNpc(p1, the_npcs);
		if (game.inField){
			field.drawField(p1, the_npcs);
			$('body').html(field.fieldElements);
		} else if (game.inBattle){
			if (battle.battleReady()){
				opponent.attack(pChar);
				if (opponent.isDead()){
					battle.cleanUp();
					game.doField();
				}
				if (pChar.isDead()){
					throw "You died!";
				}
			} else {
				battle.positionElements();
			}
			battle.drawBattle(pChar, opponent);
			$('body').html(battle.battleElements);
		} else if (game.inDialogue) {
			dialogue.drawDialogue();
			$('body').html(dialogue.dialogueElements);
		}
	}
	setInterval(displayPosition, 33);
	$(document).keyup(function(e){
		e.preventDefault();
		console.log("X", p1.pos_x);
		console.log("Y", p1.pos_y);
		console.log(e.keyCode);
		if (game.inField){
			if ( p1.move(e.keyCode) ){
				var wildMoemon = field.checkEncounter(p1, field);
				if ( wildMoemon ){
					opponent.name = wildMoemon;
					game.doBattle(opponent);
				}
			}
			else if (e.keyCode === 70){
				game.doBattle(opponent);
			}
		} else if ( game.inBattle && battle.battleReady() ){
			if (e.keyCode === 66){
				pChar.attack(opponent);
			}
		} else if ( game.inDialogue ){
			if (e.keyCode === 89){
				//accept
				p1.pos_x--;
				opponent.name = dialogue.moemon
				game.doBattle(opponent);
			} else if (e.keyCode === 78){
				//decline
				p1.pos_x--;
				game.doField();
			}
		}
	});

});
