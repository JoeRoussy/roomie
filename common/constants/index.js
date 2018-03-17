export const roommateSurvey = {
    questions: [
        'You try and go to bed early (before midnight) on weeknights.',
        'You often pull all-nighers to finish work.',
        'You like to do homework at home.',
        'You often have friends over to your place.',
        'Everything has a place in your room.',
        'You find it difficult to introduce yourself to other people.',
        'You often get so lost in thoughts that you ignore or forget your surroundings.',
        'You find it easy to stay relaxed even when there is some pressure.',
        'You do not usually initiate conversations.',
        'You rarely do something just out of sheer curiosity.',
        'You cannot stand clutter.',
        'You feel superior to other people.',
        'Being organized is more important to you than being adaptable.',
        'You are usually highly motivated and energetic.',
        'Winning a debate matters less to you than making sure no one gets upset.',
        'You often feel as if you have to justify yourself to other people.',
        'Your home and work environments are quite tidy.',
        'You do not mind being at the center of attention.',
        'You consider yourself more practical than creative.',
        'You are not easily upset.',
        'Your travel plans are usually well thought out.',
        'It is often difficult for you to relate to other people’s feelings.',
        'Your mood can change very quickly.',
        'In a discussion, truth should be more important than people’s sensitivities.',
        'You rarely worry about how your actions affect other people.',
        'Your work style is closer to random energy spikes than to a methodical and organized approach.',
        'You are often envious of others.',
        'An interesting book or a video game is often better than a social event.',
        'Being able to develop a plan and stick to it is the most important part of every project.',
        'You rarely get carried away by fantasies and ideas.',
        'You often find yourself lost in thought when you are walking in nature.',
        'If someone does not respond to your e-mail quickly, you start worrying if you said something wrong.',
        'As a parent, you would rather see your child grow up kind than smart.',
        'You do not let other people influence your actions.',
        'When you sleep, your dreams tend to focus on the real world and its events.',
        'It does not take you much time to start getting involved in social activities at your new workplace.',
        'You are more of a natural improviser than a careful planner.',
        'Your emotions control you more than you control them.',
        'You enjoy going to social events that involve dress-up or role-play activities.',
        'You often spend time exploring unrealistic and impractical yet intriguing ideas.',
        'You would rather improvise than spend time coming up with a detailed plan.',
        'You are a relatively reserved and quiet person.',
        'If you had a business, you would find it very difficult to fire loyal but underperforming employees.',
        'You often contemplate the reasons for human existence.',
        'Logic is usually more important than heart when it comes to making important decisions.',
        'Keeping your options open is more important than having a to-do list.',
        'If your friend is sad about something, you are more likely to offer emotional support than suggest ways to deal with the problem.',
        'You rarely feel insecure.',
        'You have no difficulties coming up with a personal timetable and sticking to it.',
        'Being right is more important than being cooperative when it comes to teamwork.',
        'You think that everyone’s views should be respected regardless of whether they are supported by facts or not.',
        'You feel more energetic after spending time with a group of people.',
        'You frequently misplace your things.',
        'You see yourself as very emotionally stable.',
        'Your mind is always buzzing with unexplored ideas and plans.',
        'You would not call yourself a dreamer.',
        'You usually find it difficult to relax when talking in front of many people.',
        'Generally speaking, you rely more on your experience than your imagination.',
        'You worry too much about what other people think.',
        'If the room is full, you stay closer to the walls, avoiding the center.',
        'You have a tendency to procrastinate until there is not enough time to do everything.',
        'You feel very anxious in stressful situations.',
        'You believe that it is more rewarding to be liked by others than to be powerful.',
        'You have always been interested in unconventional and ambiguous things, e.g. in books, art, or movies.',
        'You often take initiative in social situations.'
    ],
    weightedMore: [ 0, 1, 2, 3, 4 ],
    highWeight: 3,
    errors: {
        GENERIC: 'GENERIC'
    },
    maxRecommendedRoommates: 6,
    minResponse: 0,
    maxResponse: 10
}
export const listingTypes = [
    { key: 'apt', value: 'apartment', text: 'Apartment' },
    { key: 'cnd', value: 'condo', text: 'Condominium' },
    { key: 'hse', value: 'house', text: 'House'},
    { key: 'ths', value: 'townhouse', text: 'Town House'},
    { key: 'oth', value: 'other', text: 'Other'}
]

// TODO: Remove the provinces that do not have cities in the list
export const provinces = [
    { key: 'ON', value: 'Ontario', text: 'Ontario' },
    { key: 'QC', value: 'Quebec', text: 'Quebec' },
    { key: 'NS', value: 'Nova Scotia', text: 'Nova Scotia'},
    { key: 'NB', value: 'New Brunswick', text: 'New Brunswick'},
    { key: 'MB', value: 'Manitoba', text: 'Manitoba' },
    { key: 'BC', value: 'British Columbia', text: 'British Columbia' },
    { key: 'PE', value: 'Prince Edward Island', text: 'Prince Edward Island' },
    { key: 'SK', value: 'Saskatchewan', text: 'Saskatchewan' },
    { key: 'NL', value: 'Alberta', text: 'Alberta' },
    { key: 'AB', value: 'Newfoundland and Labrador', text: 'Newfoundland and Labrador' },
    { key: 'NT', value: 'Northwest Territories', text: 'Northwest Territories' },
    { key: 'YT', value: 'Yukon', text: 'Yukon' },
    { key: 'NU', value: 'Nunavut', text: 'Nunavut' },
]

export const cities = [
    {
        province: 'Ontario',
        key: 'Toronto',
        text: 'Toronto',
        value: 'Toronto'
    },
    {
        province: 'Quebec',
        key: 'Montreal',
        text: 'Montreal',
        value: 'Montreal'
    },
    {
        province: 'Alberta',
        key: 'Calgary',
        text: 'Calgary',
        value: 'Calgary'
    },
    {
        province: 'Ontario',
        key: 'Ottawa',
        text: 'Ottawa',
        value: 'Ottawa'
    },
    {
        province: 'Alberta',
        key: 'Edmonton',
        text: 'Edmonton',
        value: 'Edmonton'
    },
    {
        province: 'Ontario',
        key: 'Mississauga',
        text: 'Mississauga',
        value: 'Mississauga'
    },
    {
        province: 'Manitoba',
        key: 'Winnipeg',
        text: 'Winnipeg',
        value: 'Winnipeg'
    },
    {
        province: 'British Columbia',
        key: 'Vancouver',
        text: 'Vancouver',
        value: 'Vancouver'
    },
    {
        province: 'Ontario',
        key: 'Brampton',
        text: 'Brampton',
        value: 'Brampton'
    },
    {
        province: 'Ontario',
        key: 'Hamilton',
        text: 'Hamilton',
        value: 'Hamilton'
    },
    {
        province: 'Quebec',
        key: 'Quebec City',
        text: 'Quebec City',
        value: 'Quebec City'
    },
    {
        province: 'British Columbia',
        key: 'Surrey',
        text: 'Surrey',
        value: 'Surrey'
    },
    {
        province: 'Quebec',
        key: 'Laval',
        text: 'Laval',
        value: 'Laval'
    },
    {
        province: 'Nova Scotia',
        key: 'Halifax',
        text: 'Halifax',
        value: 'Halifax'
    },
    {
        province: 'Ontario',
        key: 'London',
        text: 'London',
        value: 'London'
    },
    {
        province: 'Ontario',
        key: 'Markham',
        text: 'Markham',
        value: 'Markham'
    },
    {
        province: 'Ontario',
        key: 'Vaughan',
        text: 'Vaughan',
        value: 'Vaughan'
    },
    {
        province: 'Quebec',
        key: 'Gatineau',
        text: 'Gatineau',
        value: 'Gatineau'
    },
    {
        province: 'Quebec',
        key: 'Longueuil',
        text: 'Longueuil',
        value: 'Longueuil'
    },
    {
        province: 'British Columbia',
        key: 'Burnaby',
        text: 'Burnaby',
        value: 'Burnaby'
    },
    {
        province: 'Saskachewan',
        key: 'Saskatoon',
        text: 'Saskatoon',
        value: 'Saskatoon'
    },
    {
        province: 'Ontario',
        key: 'Kitchener',
        text: 'Kitchener',
        value: 'Kitchener'
    },
    {
        province: 'Ontario',
        key: 'Windsor',
        text: 'Windsor',
        value: 'Windsor'
    },
    {
        province: 'Saskachewan',
        key: 'Regina',
        text: 'Regina',
        value: 'Regina'
    },
    {
        province: 'British Columbia',
        key: 'Richmond',
        text: 'Richmond',
        value: 'Richmond'
    },
    {
        province: 'Ontario',
        key: 'Richmond Hill',
        text: 'Richmond Hill',
        value: 'Richmond Hill'
    },
    {
        province: 'Ontario',
        key: 'Oakville',
        text: 'Oakville',
        value: 'Oakville'
    },
    {
        province: 'Ontario',
        key: 'Burlington',
        text: 'Burlington',
        value: 'Burlington'
    },
    {
        province: 'Ontario',
        key: 'Sudbury',
        text: 'Sudbury',
        value: 'Sudbury'
    },
    {
        province: 'Quebec',
        key: 'Sherbrooke',
        text: 'Sherbrooke',
        value: 'Sherbrooke'
    },
    {
        province: 'Ontario',
        key: 'Oshawa',
        text: 'Oshawa',
        value: 'Oshawa'
    },
    {
        province: 'Quebec',
        key: 'Saguenay',
        text: 'Saguenay',
        value: 'Saguenay'
    },
    {
        province: 'Quebec',
        key: 'Levis',
        text: 'Levis',
        value: 'Levis'
    },
    {
        province: 'Ontario',
        key: 'Barrie',
        text: 'Barrie',
        value: 'Barrie'
    },
    {
        province: 'British Columbia',
        key: 'Abbotsford',
        text: 'Abbotsford',
        value: 'Abbotsford'
    },
    {
        province: 'Quebec',
        key: 'Coquitlam',
        text: 'Coquitlam',
        value: 'Coquitlam'
    },
    {
        province: 'Quebec',
        key: 'Trois-Rivieres',
        text: 'Trois-Rivieres',
        value: 'Trois-Rivieres'
    },
    {
        province: 'Ontario',
        key: 'St. Catharines',
        text: 'St. Catharines',
        value: 'St. Catharines'
    },
    {
        province: 'Ontario',
        key: 'Guelph',
        text: 'Guelph',
        value: 'Guelph'
    },
    {
        province: 'Ontario',
        key: 'Cambridge',
        text: 'Cambridge',
        value: 'Cambridge'
    },
    {
        province: 'Ontario',
        key: 'Whitby',
        text: 'Whitby',
        value: 'Whitby'
    },
    {
        province: 'British Columbia',
        key: 'Kelowna',
        text: 'Kelowna',
        value: 'Kelowna'
    },
    {
        province: 'Ontario',
        key: 'Kingston',
        text: 'Kingston',
        value: 'Kingston'
    },
    {
        province: 'Ontario',
        key: 'Ajax',
        text: 'Ajax',
        value: 'Ajax'
    },
    {
        province: 'British Columbia',
        key: 'Langley',
        text: 'Langley',
        value: 'Langley'
    },
    {
        province: 'British Columbia',
        key: 'Saanich',
        text: 'Saanich',
        value: 'Saanich'
    },
    {
        province: 'QuebeTerrebonnec',
        key: 'Terrebonne',
        text: 'Terrebonne',
        value: 'Terrebonne'
    },
    {
        province: 'Ontario',
        key: 'Milton',
        text: 'Milton',
        value: 'Milton'
    },
    {
        province: 'Newfoundland',
        key: 'St. John\'s',
        text: 'St. John\'s',
        value: 'St. John\'s'
    },
    {
        province: 'Ontario',
        key: 'Thunder Bay',
        text: 'Thunder Bay',
        value: 'Thunder Bay'
    },
    {
        province: 'Ontario',
        key: 'Waterloo',
        text: 'Waterloo',
        value: 'Waterloo'
    },
    {
        province: 'British Columbia',
        key: 'Delta',
        text: 'Delta',
        value: 'Delta'
    },
    {
        province: 'Ontario',
        key: 'Chatham-Kent',
        text: 'Chatham-Kent',
        value: 'Chatham-Kent'
    },
    {
        province: 'Alberta',
        key: 'Red Deer',
        text: 'Red Deer',
        value: 'Red Deer'
    }
]
