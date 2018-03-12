import { wrap as coroutine } from 'co';

export const getCities = ({

}) => coroutine(function* (req, res) {
    // TODO: Do this for real by looking at the listings
    // From: https://en.wikipedia.org/wiki/List_of_towns_and_cities_with_100,000_or_more_inhabitants/country:_C
    return res.json([
        {
            name: 'Toronto'
        },
        {
            name: 'Montreal'
        },
        {
            name: 'Calgary'
        },
        {
            name: 'Ottawa'
        },
        {
            name: 'Edmonton'
        },
        {
            name: 'Mississauga'
        },
        {
            name: 'Winnipeg'
        },
        {
            name: 'Vancouver'
        },
        {
            name: 'Brampton'
        },
        {
            name: 'Hamilton'
        },
        {
            name: 'Quebec City'
        },
        {
            name: 'Surrey'
        },
        {
            name: 'Laval'
        },
        {
            name: 'Halifax'
        },
        {
            name: 'London'
        },
        {
            name: 'Markham'
        },
        {
            name: 'Vaughan'
        },
        {
            name: 'Gatineau'
        },
        {
            name: 'Longueuil'
        },
        {
            name: 'Burnaby'
        },
        {
            name: 'Saskatoon'
        },
        {
            name: 'Kitchener'
        },
        {
            name: 'Windsor'
        },
        {
            name: 'Regina'
        },
        {
            name: 'Richmond'
        },
        {
            name: 'Richmond Hill'
        },
        {
            name: 'Oakville'
        },
        {
            name: 'Burlington'
        },
        {
            name: 'Sudbury'
        },
        {
            name: 'Sherbrooke'
        },
        {
            name: 'Oshawa'
        },
        {
            name: 'Saguenay'
        },
        {
            name: 'Lévis'
        },
        {
            name: 'Barrie'
        },
        {
            name: 'Abbotsford'
        },
        {
            name: 'Coquitlam'
        },
        {
            name: 'Trois-Rivières'
        },
        {
            name: 'St. Catharines'
        },
        {
            name: 'Guelph'
        },
        {
            name: 'Cambridge'
        },
        {
            name: 'Whitby'
        },
        {
            name: 'Kelowna'
        },
        {
            name: 'Kingston'
        },
        {
            name: 'Ajax'
        },
        {
            name: 'Langley'
        },
        {
            name: 'Saanich'
        },
        {
            name: 'Terrebonne'
        },
        {
            name: 'Milton'
        },
        {
            name: 'St. John\'s'
        },
        {
            name: 'Thunder Bay'
        },
        {
            name: 'Waterloo'
        },
        {
            name: 'Delta'
        },
        {
            name: 'Chatham-Kent'
        },
        {
            name: 'Red Deer'
        }
    ]);
});
