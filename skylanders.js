// Skylanders Database
// Contains all base characters categorized by Game, Element, and Type.
// Excludes variants by default, but labels Minis and Reimagined ones so they can be toggled in settings.

const SKYLANDERS = [
  // ==========================================
  // GAME 1: Spyro's Adventure (SSA) - 32 Cores
  // ==========================================
  // Air
  { name: "Sonic Boom", game: "Spyro's Adventure", element: "Air", type: "Core" },
  { name: "Whirlwind", game: "Spyro's Adventure", element: "Air", type: "Core" },
  { name: "Lightning Rod", game: "Spyro's Adventure", element: "Air", type: "Core" },
  { name: "Warnado", game: "Spyro's Adventure", element: "Air", type: "Core" },
  // Earth
  { name: "Bash", game: "Spyro's Adventure", element: "Earth", type: "Core" },
  { name: "Dino-Rang", game: "Spyro's Adventure", element: "Earth", type: "Core" },
  { name: "Prism Break", game: "Spyro's Adventure", element: "Earth", type: "Core" },
  { name: "Terrafin", game: "Spyro's Adventure", element: "Earth", type: "Core" },
  // Water
  { name: "Gill Grunt", game: "Spyro's Adventure", element: "Water", type: "Core" },
  { name: "Slam Bam", game: "Spyro's Adventure", element: "Water", type: "Core" },
  { name: "Zap", game: "Spyro's Adventure", element: "Water", type: "Core" },
  { name: "Wham-Shell", game: "Spyro's Adventure", element: "Water", type: "Core" },
  // Fire
  { name: "Eruptor", game: "Spyro's Adventure", element: "Fire", type: "Core" },
  { name: "Flameslinger", game: "Spyro's Adventure", element: "Fire", type: "Core" },
  { name: "Ignitor", game: "Spyro's Adventure", element: "Fire", type: "Core" },
  { name: "Sunburn", game: "Spyro's Adventure", element: "Fire", type: "Core" },
  // Tech
  { name: "Boomer", game: "Spyro's Adventure", element: "Tech", type: "Core" },
  { name: "Drill Sergeant", game: "Spyro's Adventure", element: "Tech", type: "Core" },
  { name: "Trigger Happy", game: "Spyro's Adventure", element: "Tech", type: "Core" },
  { name: "Drobot", game: "Spyro's Adventure", element: "Tech", type: "Core" },
  // Undead
  { name: "Chop Chop", game: "Spyro's Adventure", element: "Undead", type: "Core" },
  { name: "Cynder", game: "Spyro's Adventure", element: "Undead", type: "Core" },
  { name: "Ghost Roaster", game: "Spyro's Adventure", element: "Undead", type: "Core" },
  { name: "Hex", game: "Spyro's Adventure", element: "Undead", type: "Core" },
  // Life
  { name: "Camo", game: "Spyro's Adventure", element: "Life", type: "Core" },
  { name: "Stealth Elf", game: "Spyro's Adventure", element: "Life", type: "Core" },
  { name: "Stump Smash", game: "Spyro's Adventure", element: "Life", type: "Core" },
  { name: "Zook", game: "Spyro's Adventure", element: "Life", type: "Core" },
  // Magic
  { name: "Spyro", game: "Spyro's Adventure", element: "Magic", type: "Core" },
  { name: "Voodood", game: "Spyro's Adventure", element: "Magic", type: "Core" },
  { name: "Wrecking Ball", game: "Spyro's Adventure", element: "Magic", type: "Core" },
  { name: "Double Trouble", game: "Spyro's Adventure", element: "Magic", type: "Core" },

  // ==========================================
  // GAME 2: Giants (SG) - 8 Giants, 8 new Cores
  // ==========================================
  // Giants
  { name: "Tree Rex", game: "Giants", element: "Life", type: "Giant" },
  { name: "Bouncer", game: "Giants", element: "Tech", type: "Giant" },
  { name: "Swarm", game: "Giants", element: "Air", type: "Giant" },
  { name: "Crusher", game: "Giants", element: "Earth", type: "Giant" },
  { name: "Thumpback", game: "Giants", element: "Water", type: "Giant" },
  { name: "Hot Head", game: "Giants", element: "Fire", type: "Giant" },
  { name: "Eye-Brawl", game: "Giants", element: "Undead", type: "Giant" },
  { name: "Ninjini", game: "Giants", element: "Magic", type: "Giant" },
  // Cores
  { name: "Pop Fizz", game: "Giants", element: "Magic", type: "Core" },
  { name: "Jet-Vac", game: "Giants", element: "Air", type: "Core" },
  { name: "Flashwing", game: "Giants", element: "Earth", type: "Core" },
  { name: "Hot Dog", game: "Giants", element: "Fire", type: "Core" },
  { name: "Fright Rider", game: "Giants", element: "Undead", type: "Core" },
  { name: "Sprocket", game: "Giants", element: "Tech", type: "Core" },
  { name: "Chill", game: "Giants", element: "Water", type: "Core" },
  { name: "Shroomboom", game: "Giants", element: "Life", type: "Core" },

  // ==========================================
  // GAME 3: Swap Force (SSF) - 16 Swappers, 16 Cores
  // ==========================================
  // Swappers
  { name: "Blast Zone", game: "Swap Force", element: "Fire", type: "Swapper" },
  { name: "Fire Kraken", game: "Swap Force", element: "Fire", type: "Swapper" },
  { name: "Wash Buckler", game: "Swap Force", element: "Water", type: "Swapper" },
  { name: "Freeze Blade", game: "Swap Force", element: "Water", type: "Swapper" },
  { name: "Magna Charge", game: "Swap Force", element: "Tech", type: "Swapper" },
  { name: "Spy Rise", game: "Swap Force", element: "Tech", type: "Swapper" },
  { name: "Hoot Loop", game: "Swap Force", element: "Magic", type: "Swapper" },
  { name: "Trap Shadow", game: "Swap Force", element: "Magic", type: "Swapper" },
  { name: "Grilla Drilla", game: "Swap Force", element: "Life", type: "Swapper" },
  { name: "Stink Bomb", game: "Swap Force", element: "Life", type: "Swapper" },
  { name: "Free Ranger", game: "Swap Force", element: "Air", type: "Swapper" },
  { name: "Boom Jet", game: "Swap Force", element: "Air", type: "Swapper" },
  { name: "Rubble Rouser", game: "Swap Force", element: "Earth", type: "Swapper" },
  { name: "Doom Stone", game: "Swap Force", element: "Earth", type: "Swapper" },
  { name: "Night Shift", game: "Swap Force", element: "Undead", type: "Swapper" },
  { name: "Rattle Shake", game: "Swap Force", element: "Undead", type: "Swapper" },
  // Cores
  { name: "Bumble Blast", game: "Swap Force", element: "Life", type: "Core" },
  { name: "Zoo Lou", game: "Swap Force", element: "Life", type: "Core" },
  { name: "Countdown", game: "Swap Force", element: "Tech", type: "Core" },
  { name: "Wind-Up", game: "Swap Force", element: "Tech", type: "Core" },
  { name: "Dune Bug", game: "Swap Force", element: "Magic", type: "Core" },
  { name: "Star Strike", game: "Swap Force", element: "Magic", type: "Core" },
  { name: "Fryno", game: "Swap Force", element: "Fire", type: "Core" },
  { name: "Smolderdash", game: "Swap Force", element: "Fire", type: "Core" },
  { name: "Pop Thorn", game: "Swap Force", element: "Air", type: "Core" },
  { name: "Scratch", game: "Swap Force", element: "Air", type: "Core" },
  { name: "Grim Creeper", game: "Swap Force", element: "Undead", type: "Core" },
  { name: "Roller Brawl", game: "Swap Force", element: "Undead", type: "Core" },
  { name: "Scorp", game: "Swap Force", element: "Earth", type: "Core" },
  { name: "Slobber Tooth", game: "Swap Force", element: "Earth", type: "Core" },
  { name: "Punk Shock", game: "Swap Force", element: "Water", type: "Core" },
  { name: "Rip Tide", game: "Swap Force", element: "Water", type: "Core" },

  // ==========================================
  // GAME 4: Trap Team (STT) - 18 Trap Masters, 18 Cores, 16 Minis
  // ==========================================
  // Trap Masters
  { name: "Blastermind", game: "Trap Team", element: "Magic", type: "Trap Master" },
  { name: "Enigma", game: "Trap Team", element: "Magic", type: "Trap Master" },
  { name: "Snap Shot", game: "Trap Team", element: "Water", type: "Trap Master" },
  { name: "Lob-Star", game: "Trap Team", element: "Water", type: "Trap Master" },
  { name: "Wildfire", game: "Trap Team", element: "Fire", type: "Trap Master" },
  { name: "Ka-Boom", game: "Trap Team", element: "Fire", type: "Trap Master" },
  { name: "Wallop", game: "Trap Team", element: "Earth", type: "Trap Master" },
  { name: "Head Rush", game: "Trap Team", element: "Earth", type: "Trap Master" },
  { name: "Gusto", game: "Trap Team", element: "Air", type: "Trap Master" },
  { name: "Thunderbolt", game: "Trap Team", element: "Air", type: "Trap Master" },
  { name: "Bushwhack", game: "Trap Team", element: "Life", type: "Trap Master" },
  { name: "Tuff Luck", game: "Trap Team", element: "Life", type: "Trap Master" },
  { name: "Jawbreaker", game: "Trap Team", element: "Tech", type: "Trap Master" },
  { name: "Gearshift", game: "Trap Team", element: "Tech", type: "Trap Master" },
  { name: "Krypt King", game: "Trap Team", element: "Undead", type: "Trap Master" },
  { name: "Short Cut", game: "Trap Team", element: "Undead", type: "Trap Master" },
  { name: "Knight Light", game: "Trap Team", element: "Light", type: "Trap Master" },
  { name: "Knight Mare", game: "Trap Team", element: "Dark", type: "Trap Master" },
  // Cores
  { name: "Deja Vu", game: "Trap Team", element: "Magic", type: "Core" },
  { name: "Cobra Cadabra", game: "Trap Team", element: "Magic", type: "Core" },
  { name: "Echo", game: "Trap Team", element: "Water", type: "Core" },
  { name: "Flip Wreck", game: "Trap Team", element: "Water", type: "Core" },
  { name: "Torch", game: "Trap Team", element: "Fire", type: "Core" },
  { name: "Trail Blazer", game: "Trap Team", element: "Fire", type: "Core" },
  { name: "Fist Bump", game: "Trap Team", element: "Earth", type: "Core" },
  { name: "Rocky Roll", game: "Trap Team", element: "Earth", type: "Core" },
  { name: "Blades", game: "Trap Team", element: "Air", type: "Core" },
  { name: "Fling Kong", game: "Trap Team", element: "Air", type: "Core" },
  { name: "Food Fight", game: "Trap Team", element: "Life", type: "Core" },
  { name: "High Five", game: "Trap Team", element: "Life", type: "Core" },
  { name: "Chopper", game: "Trap Team", element: "Tech", type: "Core" },
  { name: "Tread Head", game: "Trap Team", element: "Tech", type: "Core" },
  { name: "Funny Bone", game: "Trap Team", element: "Undead", type: "Core" },
  { name: "Bat Spin", game: "Trap Team", element: "Undead", type: "Core" },
  { name: "Spotlight", game: "Trap Team", element: "Light", type: "Core" },
  { name: "Blackout", game: "Trap Team", element: "Dark", type: "Core" },
  // Minis (Labelled as variants)
  { name: "Spry", game: "Trap Team", element: "Magic", type: "Mini", isVariant: true },
  { name: "Mini Jini", game: "Trap Team", element: "Magic", type: "Mini", isVariant: true },
  { name: "Terrabite", game: "Trap Team", element: "Earth", type: "Mini", isVariant: true },
  { name: "Biter", game: "Trap Team", element: "Earth", type: "Mini", isVariant: true },
  { name: "Gill Runt", game: "Trap Team", element: "Water", type: "Mini", isVariant: true },
  { name: "Thumpling", game: "Trap Team", element: "Water", type: "Mini", isVariant: true },
  { name: "Weeruptor", game: "Trap Team", element: "Fire", type: "Mini", isVariant: true },
  { name: "Small Fry", game: "Trap Team", element: "Fire", type: "Mini", isVariant: true },
  { name: "Drobit", game: "Trap Team", element: "Tech", type: "Mini", isVariant: true },
  { name: "Trigger Snappy", game: "Trap Team", element: "Tech", type: "Mini", isVariant: true },
  { name: "Hijinx", game: "Trap Team", element: "Undead", type: "Mini", isVariant: true },
  { name: "Eye-Small", game: "Trap Team", element: "Undead", type: "Mini", isVariant: true },
  { name: "Whisper Elf", game: "Trap Team", element: "Life", type: "Mini", isVariant: true },
  { name: "Barkley", game: "Trap Team", element: "Life", type: "Mini", isVariant: true },
  { name: "Breeze", game: "Trap Team", element: "Air", type: "Mini", isVariant: true },
  { name: "Pet-Vac", game: "Trap Team", element: "Air", type: "Mini", isVariant: true },

  // ==========================================
  // GAME 5: SuperChargers (SSC) - 10 New, 2 Nintendo guests, 8 Reimagined
  // ==========================================
  // New SuperChargers
  { name: "Spitfire", game: "SuperChargers", element: "Fire", type: "SuperCharger" },
  { name: "Stormblade", game: "SuperChargers", element: "Air", type: "SuperCharger" },
  { name: "Nightfall", game: "SuperChargers", element: "Dark", type: "SuperCharger" },
  { name: "Astroblast", game: "SuperChargers", element: "Light", type: "SuperCharger" },
  { name: "Fiesta", game: "SuperChargers", element: "Undead", type: "SuperCharger" },
  { name: "Smash Hit", game: "SuperChargers", element: "Earth", type: "SuperCharger" },
  { name: "Dive-Clops", game: "SuperChargers", element: "Water", type: "SuperCharger" },
  { name: "High Volt", game: "SuperChargers", element: "Tech", type: "SuperCharger" },
  { name: "Splat", game: "SuperChargers", element: "Magic", type: "SuperCharger" },
  { name: "Thrillipede", game: "SuperChargers", element: "Life", type: "SuperCharger" },
  // Nintendo Guests
  { name: "Turbo Charge Donkey Kong", game: "SuperChargers", element: "Life", type: "Guest" },
  { name: "Hammer Slam Bowser", game: "SuperChargers", element: "Fire", type: "Guest" },
  // Reimagined/variants
  { name: "Big Bubble Pop Fizz", game: "SuperChargers", element: "Magic", type: "SuperCharger", isVariant: true },
  { name: "Bone Bash Roller Brawl", game: "SuperChargers", element: "Undead", type: "SuperCharger", isVariant: true },
  { name: "Deep Dive Gill Grunt", game: "SuperChargers", element: "Water", type: "SuperCharger", isVariant: true },
  { name: "Double Dare Trigger Happy", game: "SuperChargers", element: "Tech", type: "SuperCharger", isVariant: true },
  { name: "Hurricane Jet-Vac", game: "SuperChargers", element: "Air", type: "SuperCharger", isVariant: true },
  { name: "Lava Lance Eruptor", game: "SuperChargers", element: "Fire", type: "SuperCharger", isVariant: true },
  { name: "Shark Shooter Terrafin", game: "SuperChargers", element: "Earth", type: "SuperCharger", isVariant: true },
  { name: "Super Shot Stealth Elf", game: "SuperChargers", element: "Life", type: "SuperCharger", isVariant: true },

  // ==========================================
  // GAME 6: Imaginators (SI) - 20 Master/Guest Senseis, 11 Villain Senseis
  // ==========================================
  // Master Senseis
  { name: "Air Strike", game: "Imaginators", element: "Air", type: "Sensei" },
  { name: "Ambush", game: "Imaginators", element: "Life", type: "Sensei" },
  { name: "Aurora", game: "Imaginators", element: "Light", type: "Sensei" },
  { name: "Barbella", game: "Imaginators", element: "Earth", type: "Sensei" },
  { name: "Boom Bloom", game: "Imaginators", element: "Life", type: "Sensei" },
  { name: "Buckshot", game: "Imaginators", element: "Magic", type: "Sensei" },
  { name: "Chain Reaction", game: "Imaginators", element: "Tech", type: "Sensei" },
  { name: "Chopscotch", game: "Imaginators", element: "Undead", type: "Sensei" },
  { name: "Ember", game: "Imaginators", element: "Fire", type: "Sensei" },
  { name: "Flare Wolf", game: "Imaginators", element: "Fire", type: "Sensei" },
  { name: "King Pen", game: "Imaginators", element: "Water", type: "Sensei" },
  { name: "Mysticat", game: "Imaginators", element: "Magic", type: "Sensei" },
  { name: "Pit Boss", game: "Imaginators", element: "Undead", type: "Sensei" },
  { name: "Ro-Bow", game: "Imaginators", element: "Tech", type: "Sensei" },
  { name: "Starcast", game: "Imaginators", element: "Dark", type: "Sensei" },
  { name: "Tidepool", game: "Imaginators", element: "Water", type: "Sensei" },
  { name: "Tri-Tip", game: "Imaginators", element: "Earth", type: "Sensei" },
  { name: "Wild Storm", game: "Imaginators", element: "Air", type: "Sensei" },
  // Guest Senseis
  { name: "Crash Bandicoot", game: "Imaginators", element: "Life", type: "Guest" },
  { name: "Dr. Neo Cortex", game: "Imaginators", element: "Tech", type: "Guest" },
  // Villain Senseis
  { name: "Bad Juju", game: "Imaginators", element: "Air", type: "Villain" },
  { name: "Blaster-Tron", game: "Imaginators", element: "Tech", type: "Villain" },
  { name: "Chompy Mage", game: "Imaginators", element: "Life", type: "Villain" },
  { name: "Dr. Krankcase", game: "Imaginators", element: "Tech", type: "Villain" },
  { name: "Golden Queen", game: "Imaginators", element: "Earth", type: "Villain" },
  { name: "Grave Clobber", game: "Imaginators", element: "Water", type: "Villain" },
  { name: "Hood Sickle", game: "Imaginators", element: "Dark", type: "Villain" },
  { name: "Kaos", game: "Imaginators", element: "Kaos", type: "Villain" },
  { name: "Pain-Yatta", game: "Imaginators", element: "Magic", type: "Villain" },
  { name: "Tae Kwon Crow", game: "Imaginators", element: "Fire", type: "Villain" },
  { name: "Wolfgang", game: "Imaginators", element: "Undead", type: "Villain" }
];
