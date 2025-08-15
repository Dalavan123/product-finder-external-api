export const dummyJsonPayload = {
  products: [
    {
      id: 1,
      title: 'Phone X',
      description: 'Nice phone',
      price: 999,
      category: 'smartphones',
      rating: 4.6,
      thumbnail: 'thumb.jpg',
      images: ['img1.jpg', 'img2.jpg'],
    },
    {
      id: 2,
      title: 'Budget Phone',
      description: 'Affordable',
      price: 199,
      category: 'smartphones',
      rating: 4.0,
      thumbnail: '',
      images: ['fallback.jpg'],
    },
  ],
  total: 2,
  skip: 0,
  limit: 30,
};
