interface DataType {
  id: number;
  page: string;
  thumb: string;
  title: string;
  total?: string;
  class?: string;
  query?: string;
}

const location_data: DataType[] = [
  // home_1
  {
    id: 1,
    page: "home_1",
    thumb: "/assets/img/destination/tu/des-1.jpg",
    title: "Paris",
    total: "05",
  },
  {
    id: 2,
    page: "home_1",
    thumb: "/assets/img/destination/tu/des-2.jpg",
    title: "Australia",
    total: "08",
  },
  {
    id: 3,
    page: "home_1",
    thumb: "/assets/img/destination/tu/des-3.jpg",
    title: "New York",
    total: "06",
  },
  {
    id: 4,
    page: "home_1",
    thumb: "/assets/img/destination/tu/des-4.jpg",
    title: "Spain City",
    total: "07",
  },
  {
    id: 5,
    page: "home_1",
    thumb: "/assets/img/destination/tu/des-2.jpg",
    title: "Australia",
    total: "08",
  },

  // home_2
  {
    id: 1,
    page: "home_2",
    thumb: "/assets/img/location/su/destination.jpg",
    title: "New York City",
    class: "col-xl-3",
  },
  {
    id: 2,
    page: "home_2",
    thumb: "/assets/img/location/su/destination-2.jpg",
    title: "Australia",
    class: "col-xl-3",
  },
  {
    id: 3,
    page: "home_2",
    thumb: "/assets/img/location/su/destination-3.jpg",
    title: "California City",
    class: "col-xl-6",
  },
  {
    id: 4,
    page: "home_2",
    thumb: "/assets/img/location/su/destination-4.jpg",
    title: "Japan",
    class: "col-xl-6",
  },
  {
    id: 5,
    page: "home_2",
    thumb: "/assets/img/location/su/destination-5.jpg",
    title: "Spain City",
    class: "col-xl-3",
  },
  {
    id: 6,
    page: "home_2",
    thumb: "/assets/img/location/su/destination-6.jpg",
    title: "Paris",
    class: "col-xl-3",
  },

  // home_3 (Home Three – SENİN LİSTEN)
  {
    id: 1,
    page: "home_3",
    thumb: "/assets/img/location/des-ist.webp", // görseli siz değişebilirsiniz
    title: "Istanbul",
    query: "Istanbul",
    total: "1",
  },
  {
    id: 2,
    page: "home_3",
    thumb: "/assets/img/location/des-antalya.webp",
    title: "Antalya",
    query: "Antalya",
    total: "1",
  },
  {
    id: 3,
    page: "home_3",
    thumb: "/assets/img/location/des-cap.webp",
    title: "Cappadocia",
    query: "Cappadocia",
    total: "1",
  },
  {
    id: 4,
    page: "home_3",
    thumb: "/assets/img/location/des-kus.webp",
    title: "Kusadasi",
    query: "Kusadasi",
    total: "1",
  },
  {
    id: 5,
    page: "home_3",
    thumb: "/assets/img/location/des-side.webp",
    title: "Side",
    query: "Side",
    total: "1",
  },
  {
    id: 6,
    page: "home_3",
    thumb: "/assets/img/location/des-fet.webp",
    title: "Fethiye",
    query: "Fethiye",
    total: "1",
  },
  {
    id: 7,
    page: "home_3",
    thumb: "/assets/img/location/des-belek.webp",
    title: "Belek",
    query: "Belek",
    total: "1",
  },
  {
    id: 8,
    page: "home_3",
    thumb: "/assets/img/location/des-alan.webp",
    title: "Alanya",
    query: "Alanya",
    total: "1",
  },

  // home_5
  {
    id: 1,
    page: "home_5",
    thumb: "/assets/img/location/location-2/thumb.jpg",
    title: "Paris",
    total: "05",
  },
  {
    id: 2,
    page: "home_5",
    thumb: "/assets/img/location/location-2/thumb-2.jpg",
    title: "Australia",
    total: "08",
  },
  {
    id: 3,
    page: "home_5",
    thumb: "/assets/img/location/location-2/thumb-3.jpg",
    title: "New York",
    total: "06",
  },
  {
    id: 4,
    page: "home_5",
    thumb: "/assets/img/location/location-2/thumb-4.jpg",
    title: "Spain City",
    total: "07",
  },

  // home_6
  {
    id: 1,
    page: "home_6",
    thumb: "/assets/img/location/location.jpg",
    title: "Paris",
    total: "05",
  },
  {
    id: 2,
    page: "home_6",
    thumb: "/assets/img/location/location-2.jpg",
    title: "Australia",
    total: "08",
  },
  {
    id: 3,
    page: "home_6",
    thumb: "/assets/img/location/location-3.jpg",
    title: "New York",
    total: "06",
  },
  {
    id: 4,
    page: "home_6",
    thumb: "/assets/img/location/location-4.jpg",
    title: "Spain City",
    total: "07",
  },

  // home_7
  {
    id: 1,
    page: "home_7",
    thumb: "/assets/img/foods/food-1.jpg",
    title: "American",
    total: "05",
  },
  {
    id: 2,
    page: "home_7",
    thumb: "/assets/img/foods/food-2.jpg",
    title: "Mexican",
    total: "12",
  },
  {
    id: 3,
    page: "home_7",
    thumb: "/assets/img/foods/food-3.jpg",
    title: "Italian",
    total: "11",
  },
  {
    id: 4,
    page: "home_7",
    thumb: "/assets/img/foods/food-4.jpg",
    title: "Vegetarians",
    total: "04",
  },
  {
    id: 5,
    page: "home_7",
    thumb: "/assets/img/foods/food-5.jpg",
    title: "Japanese",
    total: "13",
  },

  // home_7_2
  {
    id: 1,
    page: "home_7_2",
    thumb: "/assets/img/location/location-5/location.jpg",
    title: "New york City",
    total: "05",
  },
  {
    id: 2,
    page: "home_7_2",
    thumb: "/assets/img/location/location-5/location-2.jpg",
    title: "Australia",
    total: "07",
  },
  {
    id: 3,
    page: "home_7_2",
    thumb: "/assets/img/location/location-5/location-3.jpg",
    title: "Switzerland",
    total: "12",
  },
  {
    id: 4,
    page: "home_7_2",
    thumb: "/assets/img/location/location-5/location-4.jpg",
    title: "Japan City",
    total: "03",
  },
  {
    id: 5,
    page: "home_7_2",
    thumb: "/assets/img/location/location-5/location-2.jpg",
    title: "Australia",
    total: "07",
  },
  {
    id: 6,
    page: "home_7_2",
    thumb: "/assets/img/location/location-5/location-3.jpg",
    title: "Switzerland",
    total: "12",
  },
];

export default location_data;
