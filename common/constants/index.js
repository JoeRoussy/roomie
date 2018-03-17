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
