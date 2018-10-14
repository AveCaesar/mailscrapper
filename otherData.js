exports.CATEGORIES = [
  'ART_AND_DESIGN',
  'AUTO_AND_VEHICLES',
  'BEAUTY',
  'BOOKS_AND_REFERENCE',
  'BUSINESS',
  'COMICS',
  'COMMUNICATION',
  'DATING',
  'EDUCATION',
  'ENTERTAINMENT',
  'EVENTS',
  'FINANCE',
  'FOOD_AND_DRINK',
  'HEALTH_AND_FITNESS',
  'HOUSE_AND_HOME',
  'LIBRARIES_AND_DEMO',
  'LIFESTYLE',
  'MAPS_AND_NAVIGATION',
  'MEDICAL',
  'MUSIC_AND_AUDIO',
  'NEWS_AND_MAGAZINES',
  'PARENTING',
  'PERSONALIZATION',
  'PHOTOGRAPHY',
  'PRODUCTIVITY',
  'SHOPPING',
  'SOCIAL',
  'SPORTS',
  'TOOLS',
  'TRAVEL_AND_LOCAL',
  'VIDEO_PLAYERS',
  'WEATHER',
  'GAME_ACTION',
  'GAME_ADVENTURE',
  'GAME_ARCADE',
  'GAME_BOARD',
  'GAME_CARD',
  'GAME_CASINO',
  'GAME_CASUAL',
  'GAME_EDUCATIONAL',
  'GAME_MUSIC',
  'GAME_PUZZLE',
  'GAME_RACING',
  'GAME_ROLE_PLAYING',
  'GAME_SIMULATION',
  'GAME_SPORTS',
  'GAME_STRATEGY',
  'GAME_TRIVIA',
  'GAME_WORD',
  'FAMILY_ACTION',
  'FAMILY_BRAINGAMES',
  'FAMILY_CREATE',
  'FAMILY_EDUCATION',
  'FAMILY_MUSICVIDEO',
  'FAMILY_PRETEND'
]

exports.getSelector = (selector_name) => ({
  GRID_CONTAINER: ".card.no-rationale",
  GRID_NAME: "a.subtitle",
  APP_MAIL: ".xyOfqd > .hAyfc:last-child > .htlgb .htlgb > div:nth-child(2) > a",
  APP_ADDITIONAL: ".xyOfqd > .hAyfc:last-child > .htlgb .htlgb > div:last-child",
  GRID_MORE_BUTTON: "#show-more-button"
})[selector_name]
