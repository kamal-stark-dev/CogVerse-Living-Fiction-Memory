// Curate specific characters as you have time -- these override the generic
// list below. Anyone not listed here still gets sensible generic prompts,
// so this never breaks for new characters you haven't gotten to yet.
const CURATED = {
  // Breaking Bad
  "Gustavo Fring": [
    "What makes a successful leader?",
    "Why were you so patient in taking revenge on the Salamancas?",
    "Did you ever respect Walter White?",
    "Can business and emotion ever truly stay separate?",
  ],

  "Hank Schrader": [
    "When did you first suspect Walter White?",
    "What makes someone a good law enforcement officer?",
    "What's the toughest case you've ever worked?",
    "How did your recovery after El Paso change you?",
  ],

  "Jesse Pinkman": [
    "Do you think Walter ever truly cared about you?",
    "What's your biggest regret?",
    "What advice would you give someone making bad choices?",
    "What kept you going through everything?",
  ],

  "Mike Ehrmantraut": [
    "What's your personal code of ethics?",
    "Why did you keep working in the criminal world?",
    "Did Walter White ruin everything?",
    "What's the most important lesson you've learned?",
  ],

  "Saul Goodman": [
    "Better Call Saul—why should I?",
    "What's the craziest client you've ever had?",
    "Did you actually like Walter White?",
    "Can anyone really outrun their past?",
    "Sell me a pen.",
  ],

  "Skyler White": [
    "Do you think Walter did it for the family?",
    "When did you realize Walter was hiding something?",
    "Do you regret staying with Walter?",
    "Could your family have been saved?",
  ],

  "Todd Alquist": [
    "Why did you admire Walter White so much?",
    "What did loyalty mean to you?",
    "Why did you always stay so calm?",
    "Would you change anything about your life?",
  ],

  "Tuco Salamanca": [
    "TIGHT! TIGHT! TIGHT! What's your secret?",
    "Why did everyone fear you?",
    "What makes someone worthy of respect?",
    "Who's crazier—you or Hector?",
  ],

  "Walter White": [
    "Did you really do it for your family?",
    "When did Walter White become Heisenberg?",
    "Do you think Jesse ever forgave you?",
    "Was becoming Heisenberg worth it?",
    "Say my name.",
  ],

  // Demon Slayer
  Akaza: [
    "Why do you refuse to kill women?",
    "Do you regret becoming a demon?",
    "Why were you so obsessed with fighting Rengoku?",
    "If you could return to being human, would you?",
  ],

  "Giyu Tomioka": [
    "Why did you spare Nezuko?",
    "Who was the toughest demon you've ever fought?",
    "Do you consider Tanjiro your friend?",
    "What does being the Water Hashira mean to you?",
  ],

  "Inosuke Hashibira": [
    "Who's stronger—you or Tanjiro?",
    "Why do you always wear a boar's head?",
    "Have you finally learned what friendship means?",
    "Who would win in a duel: you or Zenitsu?",
  ],

  "Kyojuro Rengoku": [
    "What does it mean to set your heart ablaze?",
    "Do you have any regrets about the Mugen Train battle?",
    "What advice would you give Tanjiro?",
    "Why did you never give up against Akaza?",
  ],

  "Mitsuri Kanroji": [
    "Why did you become a Demon Slayer?",
    "How do you stay so optimistic?",
    "What makes the Love Breathing style unique?",
    "What's your favorite food?",
  ],

  "Muzan Kibutsuji": [
    "Why were you so obsessed with conquering the sun?",
    "Why did you create the Twelve Kizuki?",
    "Was immortality worth everything you sacrificed?",
    "What do you think of Tanjiro Kamado?",
  ],

  "Nezuko Kamado": [
    "How did you resist your demon instincts?",
    "What does your family mean to you?",
    "What's your happiest memory before becoming a demon?",
    "How did conquering sunlight change your life?",
  ],

  "Tanjiro Kamado": [
    "Do you think demons can be forgiven?",
    "What keeps you moving forward after losing your family?",
    "Who's the strongest Hashira in your opinion?",
    "What does kindness mean to you?",
  ],

  "Zenitsu Agatsuma": [
    "How can you fight so well while asleep?",
    "What made you become a Demon Slayer?",
    "Do you still have a crush on Nezuko?",
    "Who's stronger—you or Inosuke?",
  ],

  // Harry Potter
  "Albus Dumbledore": [
    "Do you regret keeping so many secrets from Harry?",
    "Why did you trust Severus Snape?",
    "Do you think love is the greatest form of magic?",
    "What was your greatest mistake?",
  ],

  Dobby: [
    "What was your happiest moment as a free elf?",
    "What does freedom mean to you?",
    "Why did you care so much about Harry Potter?",
    "Would you protect Harry all over again?",
  ],

  "Draco Malfoy": [
    "Did you ever truly want to become a Death Eater?",
    "Were you jealous of Harry?",
    "Do you regret the choices you made?",
    "How did the war change you?",
  ],

  "Harry Potter": [
    "What's your favorite memory at Hogwarts?",
    "Do you think you deserved to be called the Chosen One?",
    "Who taught you the most about courage?",
    "What's the hardest sacrifice you've ever made?",
    "Do you miss Sirius Black?",
  ],

  "Hermione Granger": [
    "What's your favorite spell?",
    "How important is knowledge compared to bravery?",
    "Do you think rules should always be followed?",
    "How did the Time-Turner change your life?",
  ],

  "Luna Lovegood": [
    "Why do you always stay so positive?",
    "What advice would you give to someone who feels different?",
    "What's your favorite magical creature?",
    "Did people underestimate you at Hogwarts?",
  ],

  "Ronald Weasley": [
    "What was it like growing up in the Weasley family?",
    "Were you ever jealous of Harry?",
    "Do you think chess helped you become a better wizard?",
    "What's your favorite meal cooked by your mum?",
  ],

  "Severus Snape": [
    "Did you ever stop loving Lily Potter?",
    "Why did you protect Harry?",
    "Was Dumbledore right to trust you?",
    "If you could change one decision, what would it be?",
  ],

  Voldemort: [
    "Why were you so afraid of death?",
    "Why did you create Horcruxes?",
    "Was Harry Potter always your greatest enemy?",
    "Do you regret anything from your life?",
  ],

  // Kung Fu Panda
  Kai: [
    "Why did you turn against Oogway?",
    "Do you think chi should belong to everyone?",
    "Could you defeat Tai Lung?",
    "Do you regret your obsession with power?",
  ],

  "Li Shan": [
    "What was it like finding Po again?",
    "How did the panda village survive for so long?",
    "What's the secret to living a peaceful life?",
    "What advice would you give to parents?",
  ],

  "Lord Shen": [
    "Why were you so afraid of the prophecy?",
    "What was your greatest mistake?",
    "Do you believe your fate could have been changed?",
    "Do you regret destroying the panda village?",
  ],

  "Master Crane": [
    "What's the key to staying calm in battle?",
    "What do you admire most about Po?",
    "Who's the strongest member of the Five?",
    "How did you become one of the Furious Five?",
  ],

  "Master Mantis": [
    "How can someone so small be so strong?",
    "Who's faster—you or Viper?",
    "What's the funniest thing Po has ever done?",
    "Do people underestimate you?",
  ],

  "Master Monkey": [
    "How did you stop being a troublemaker?",
    "What's the best prank you've ever pulled?",
    "Who's your closest friend in the Furious Five?",
    "What's your funniest memory with Po?",
  ],

  "Master Shifu": [
    "Did you ever forgive yourself for Tai Lung?",
    "Who was your greatest student?",
    "When did you realize Po could become the Dragon Warrior?",
    "Can anyone truly master inner peace?",
  ],

  "Master Tigress": [
    "How has Po changed your life?",
    "Who's the toughest opponent you've faced?",
    "What does strength really mean?",
    "How did Master Shifu shape you?",
  ],

  "Master Viper": [
    "How do you fight without venom?",
    "Who's the kindest member of the Furious Five?",
    "What do you admire most about Po?",
    "How do you stay so calm?",
  ],

  "Mr Ping": [
    "What's your secret noodle recipe?",
    "Did you always know Po was destined for greatness?",
    "How did you feel when Po became the Dragon Warrior?",
    "What's your favorite memory with Po?",
  ],

  Oogway: [
    "There are no accidents—what does that really mean?",
    "How did you discover inner peace?",
    "Why did you choose Po as the Dragon Warrior?",
    "Can destiny ever be changed?",
    "What advice would you give someone searching for purpose?",
  ],

  Po: [
    "Do you think Tai Lung could have been redeemed?",
    "Who's your biggest inspiration?",
    "Can anyone learn kung fu?",
    "Who would win—you or Tai Lung at your strongest?",
    "What's your funniest adventure?",
  ],

  "Tai Lung": [
    "Did Master Shifu betray you?",
    "Do you still believe the Dragon Scroll should have been yours?",
    "Could you have become a hero?",
    "What did you learn from your defeat?",
    "Would you fight Kai?",
  ],

  Zhen: [
    "How did you become Po's student?",
    "What was it like working for The Chameleon?",
    "What does being the Dragon Warrior mean to you?",
    "How has your life changed since meeting Po?",
  ],

  // MCU
  "Black Panther": [
    "What does it truly mean to be king?",
    "How has Wakanda changed after opening to the world?",
    "Would Erik Killmonger have made a good king?",
    "What advice would you give to future leaders?",
  ],

  "Black Widow": [
    "Do you think the Avengers became your real family?",
    "What do you regret the most from your past?",
    "How did you earn Hawkeye's trust?",
    "Would you make the same sacrifice again?",
  ],

  "Captain America": [
    "What does freedom mean to you?",
    "Can people like Tony Stark and Steve Rogers ever truly agree?",
    "Do you regret going back to Peggy?",
    "What's the biggest lesson from leading the Avengers?",
  ],

  "Doctor Strange": [
    "What is the greatest threat to reality?",
    "How many futures did you actually see?",
    "Was giving Thanos the Time Stone the only choice?",
    "Can destiny really be changed?",
  ],

  Hawkeye: [
    "How did becoming Ronin change you?",
    "Who's the better archer—you or Kate?",
    "What kept you grounded among gods and superheroes?",
    "Do you miss your life before the Avengers?",
  ],

  Hulk: [
    "How powerful is Hulk Clap?",
    "Who would win: Hulk or Thor?",
    "Do you still like Natasha?",
    "Would you fight Thanos again?",
    "Do you remember that Peter is Spider-Man?",
  ],

  "Iron Man": [
    "Give me startup advice.",
    "Roast me.",
    "What's the one thing you'd do differently?",
    "Do you think your daughter can be the next Tony?",
    "What's your greatest invention?",
    "Do you think Steve was right during Civil War?",
  ],

  Loki: [
    "Do you really enjoy being the God of Mischief?",
    "Who are you without the throne?",
    "Do you still envy Thor?",
    "Would you betray your allies again?",
    "What did you learn from the TVA?",
    "Are you finally a hero?",
  ],

  "Nick Fury": [
    "How did the Avengers Initiative begin?",
    "Who do you trust the most?",
    "What's your biggest secret?",
    "Did you always know Tony would become Iron Man?",
  ],

  "Spider Man": [
    "How do you balance being Peter Parker and Spider-Man?",
    "What's the hardest lesson you've learned?",
    "Do you miss Tony Stark?",
    "What makes someone a hero?",
    "Who's your favorite Avenger?",
    "How do you stay optimistic after everything?",
  ],

  Thanos: [
    "Would you still snap half the universe today?",
    "Did Gamora ever truly understand you?",
    "Do you think you were the hero of your own story?",
    "What did the Soul Stone cost you?",
  ],

  Thor: [
    "What makes someone worthy of Mjolnir?",
    "Do you miss Asgard?",
    "Who's stronger—you or Hulk?",
    "How did losing Loki change you?",
    "What's the hardest battle you've ever fought?",
    "Would you still go for the head?",
  ],

  // The Hangover
  "Alan Garner": [
    "What's the weirdest thing you've ever done?",
    "Do you still think Carlos was the best baby ever?",
    "Why did you tase Phil?",
    "Would you go to another bachelor party?",
  ],

  "Doug Billings": [
    "How does it feel to miss your own bachelor party?",
    "What's the first thing you remembered after the rooftop?",
    "Would you ever go to Vegas again?",
    "Who's the most responsible member of the Wolfpack?",
  ],

  Jade: [
    "How did you meet Stu?",
    "Did you ever think Stu would actually marry you?",
    "Would you ever visit the Wolfpack again?",
    "What's your opinion of Alan?",
  ],

  "Leslie Chow": [
    "How did you escape from the trunk?",
    "Do you actually enjoy chaos?",
    "What's your biggest score?",
    "Give me some life advice, Mr. Chow.",
  ],

  "Phil Wenneck": [
    "Would you go back to Las Vegas?",
    "Who's the biggest troublemaker in the Wolfpack?",
    "What advice would you give before a bachelor party?",
    "Do you regret anything from Vegas?",
  ],

  "Sid Garner": [
    "Did you know Alan would turn out this way?",
    "What's the most embarrassing thing Alan has done?",
    "Do you think Alan ever grew up?",
    "Were you worried about Alan during the Vegas trip?",
  ],

  "Stu Price": [
    "How did it feel waking up with a missing tooth?",
    "What advice would you give to someone going to Vegas?",
    "Would you ever trust Alan again?",
    "How did meeting Jade change your life?",
  ],
};

const GENERIC = [
  "What's the hardest lesson you've learned?",
  "Give me advice for the toughest day of my life.",
  "Roast me.",
  "What do you regret most?",
];

export function suggestedQuestions(character) {
  return CURATED[character] || GENERIC;
}
