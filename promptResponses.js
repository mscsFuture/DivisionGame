var positiveExclamations = [ 
	"Way to go!",
	"Good job!",
	"Boo-yah!",
	"Hurrah!",
	"Yipee!",
	"Yee-haw!",
	"Woohoo!",
	"Whoopee!",
	"Totally Tubular!",
	"Radical!",
	"Cowabunga!",
	"Bodacious!",
	"Righteous!",
	"Super Duper!",
	"Outstanding!",
	"Remarkable!",
	"Kudos!",
	"Exceptional!",
	"Hip Hip Hooray!",
	"You're good at this!",
	"Now you have it!",
	"Terrific!",
	"Sensational!",
	"Perfect!",
	"Outstanding!",
	"Tremendous!",
	"You got it!"
];

function getPositiveExclamation() {
	var positiveExclamation = getRandomInt(positiveExclamations.length) + 1;
	return positiveExclamations[positiveExclamation] + " ";
}