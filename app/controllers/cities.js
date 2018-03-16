import { wrap as coroutine } from 'co';

export const getCities = ({

}) => coroutine(function* (req, res) {
    // TODO: Do this for real by looking at the listings
    // From: https://en.wikipedia.org/wiki/List_of_towns_and_cities_with_100,000_or_more_inhabitants/country:_C
    return res.json({
        cities: [
            {
                province: 'Ontario',
                name: 'Toronto'
            },
            {
                province: 'Quebec',
                name: 'Montreal'
            },
            {
                province: 'Alberta',
                name: 'Calgary'
            },
            {
                province: 'Ontario',
                name: 'Ottawa'
            },
            {
                province: 'Alberta',
                name: 'Edmonton'
            },
            {
                province: 'Ontario',
                name: 'Mississauga'
            },
            {
                province: 'Manitoba',
                name: 'Winnipeg'
            },
            {
                province: 'British Columbia',
                name: 'Vancouver'
            },
            {
                province: 'Ontario',
                name: 'Brampton'
            },
            {
                province: 'Ontario',
                name: 'Hamilton'
            },
            {
                province: 'Quebec',
                name: 'Quebec City'
            },
            {
                province: 'British Columbia',
                name: 'Surrey'
            },
            {
                province: 'Quebec',
                name: 'Laval'
            },
            {
                province: 'Nova Scotia',
                name: 'Halifax'
            },
            {
                province: 'Ontario',
                name: 'London'
            },
            {
                province: 'Ontario',
                name: 'Markham'
            },
            {
                province: 'Ontario',
                name: 'Vaughan'
            },
            {
                province: 'Quebec',
                name: 'Gatineau'
            },
            {
                province: 'Quebec',
                name: 'Longueuil'
            },
            {
                province: 'British Columbia',
                name: 'Burnaby'
            },
            {
                province: 'Saskachewan',
                name: 'Saskatoon'
            },
            {
                province: 'Ontario',
                name: 'Kitchener'
            },
            {
                province: 'Ontario',
                name: 'Windsor'
            },
            {
                province: 'Saskachewan',
                name: 'Regina'
            },
            {
                province: 'British Columbia',
                name: 'Richmond'
            },
            {
                province: 'Ontario',
                name: 'Richmond Hill'
            },
            {
                province: 'Ontario',
                name: 'Oakville'
            },
            {
                province: 'Ontario',
                name: 'Burlington'
            },
            {
                province: 'Ontario',
                name: 'Sudbury'
            },
            {
                province: 'Quebec',
                name: 'Sherbrooke'
            },
            {
                province: 'Ontario',
                name: 'Oshawa'
            },
            {
                province: 'Quebec',
                name: 'Saguenay'
            },
            {
                province: 'Quebec',
                name: 'Lévis'
            },
            {
                province: 'Ontario',
                name: 'Barrie'
            },
            {
                province: 'British Columbia',
                name: 'Abbotsford'
            },
            {
                province: 'Quebec',
                name: 'Coquitlam'
            },
            {
                province: 'Quebec',
                name: 'Trois-Rivieres'
            },
            {
                province: 'Ontario',
                name: 'St. Catharines'
            },
            {
                province: 'Ontario',
                name: 'Guelph'
            },
            {
                province: 'Ontario',
                name: 'Cambridge'
            },
            {
                province: 'Ontario',
                name: 'Whitby'
            },
            {
                province: 'British Columbia',
                name: 'Kelowna'
            },
            {
                province: 'Ontario',
                name: 'Kingston'
            },
            {
                province: 'Ontario',
                name: 'Ajax'
            },
            {
                province: 'British Columbia',
                name: 'Langley'
            },
            {
                province: 'British Columbia',
                name: 'Saanich'
            },
            {
                province: 'Quebec',
                name: 'Terrebonne'
            },
            {
                province: 'Ontario',
                name: 'Milton'
            },
            {
                province: 'Newfoundland',
                name: 'St. John\'s'
            },
            {
                province: 'Ontario',
                name: 'Thunder Bay'
            },
            {
                province: 'Ontario',
                name: 'Waterloo'
            },
            {
                province: 'British Columbia',
                name: 'Delta'
            },
            {
                province: 'Ontario',
                name: 'Chatham-Kent'
            },
            {
                province: 'Alberta',
                name: 'Red Deer'
            }
        ]
    });
});
