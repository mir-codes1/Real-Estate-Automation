export const mockListings = [
  { id: 1, address: '142 Broadview Ave, Toronto, ON', price: 1350000, beds: 4, baths: 3, neighborhood: 'Riverdale', sold_date: '2024-03-01' },
  { id: 2, address: '87 Ossington Ave, Toronto, ON', price: 1125000, beds: 3, baths: 2, neighborhood: 'Roncesvalles', sold_date: '2024-03-05' },
  { id: 3, address: '310 Danforth Ave, Toronto, ON', price: 980000, beds: 3, baths: 2, neighborhood: 'Greektown', sold_date: '2024-03-08' },
  { id: 4, address: '55 Leslieville Cres, Toronto, ON', price: 1475000, beds: 4, baths: 3, neighborhood: 'Leslieville', sold_date: '2024-03-12' },
  { id: 5, address: '22 Palmerston Blvd, Toronto, ON', price: 2100000, beds: 5, baths: 4, neighborhood: 'Trinity-Bellwoods', sold_date: '2024-03-15' },
];

export const mockPosts = [
  { id: 1, listing_id: 1, address: '142 Broadview Ave', neighborhood: 'Riverdale', caption: 'Just Sold! This stunning 4-bed, 3-bath home in Riverdale closed at $1,350,000! #TorontoRealEstate #JustSold #Riverdale', platform: 'twitter', status: 'posted', created_at: '2024-03-01T10:00:00Z' },
  { id: 2, listing_id: 2, address: '87 Ossington Ave', neighborhood: 'Roncesvalles', caption: 'Just Sold! 87 Ossington Ave in Roncesvalles went for $1,125,000! #TorontoRealEstate #JustSold', platform: 'instagram', status: 'posted', created_at: '2024-03-05T11:30:00Z' },
  { id: 3, listing_id: 3, address: '310 Danforth Ave', neighborhood: 'Greektown', caption: 'Just Sold! 3-bed in Greektown closed at $980,000. #TorontoRealEstate #JustSold', platform: 'twitter', status: 'failed', created_at: '2024-03-08T09:15:00Z' },
  { id: 4, listing_id: 4, address: '55 Leslieville Cres', neighborhood: 'Leslieville', caption: 'Just Sold! Gorgeous Leslieville home fetched $1,475,000! #JustSold #Leslieville', platform: 'draft', status: 'pending', created_at: '2024-03-12T14:00:00Z' },
];

export const mockLogs = [
  { id: 1, listing_id: 1, address: '142 Broadview Ave', event_type: 'automation_result:twitter', message: 'Successfully posted to Twitter', status: 'posted', created_at: '2024-03-01T10:05:00Z' },
  { id: 2, listing_id: 2, address: '87 Ossington Ave', event_type: 'automation_result:instagram', message: 'Successfully posted to Instagram', status: 'posted', created_at: '2024-03-05T11:35:00Z' },
  { id: 3, listing_id: 3, address: '310 Danforth Ave', event_type: 'automation_result:twitter', message: 'Twitter API rate limit exceeded', status: 'failed', created_at: '2024-03-08T09:20:00Z' },
  { id: 4, listing_id: 1, address: '142 Broadview Ave', event_type: 'process_listing', message: 'Caption generated and saved as post #1', status: 'success', created_at: '2024-03-01T09:55:00Z' },
  { id: 5, listing_id: 4, address: '55 Leslieville Cres', event_type: 'send_to_automation', message: 'Payload sent to n8n for post #4', status: 'success', created_at: '2024-03-12T14:05:00Z' },
];
