// lib/shop-data.ts
import {
  Package,
  Tent,
  Flame,
  Utensils,
  Zap,
  Shield,
  Truck,
  RotateCcw,
  Tag,
} from "lucide-react";

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  rating: number;
  reviewCount: number;
  stock: number;
  tags: string[];
  isNew?: boolean;
  isSale?: boolean;
  isFeatured?: boolean;
};

export const categories = [
  { id: "all", icon: Package, label: "Бүгд" },
  { id: "camping", icon: Tent, label: "Кемпинг" },
  { id: "bbq", icon: Flame, label: "Барбекю" },
  { id: "kitchen", icon: Utensils, label: "Гал тогоо" },
  { id: "power", icon: Zap, label: "Эрчим хүч" },
  { id: "hygiene", icon: Shield, label: "Эрүүл ахуй" },
] as const;

export const sortOptions = [
  "Шинэ эхэнд",
  "Хямд эхэнд",
  "Үнэтэй эхэнд",
  "Үнэлгээгээр",
];

export const perks = [
  { icon: Truck, title: "Үнэгүй хүргэлт", desc: "100,000₮-аас дээш захиалгад" },
  {
    icon: RotateCcw,
    title: "7 хоног буцаах",
    desc: "Асуудалтай бол буцаах боломж",
  },
  {
    icon: Shield,
    title: "Чанарын баталгаа",
    desc: "Зөвхөн итгэмжлэгдсэн бараа",
  },
  { icon: Tag, title: "Шилдэг үнэ", desc: "Зах зээлийн өрсөлдөхүйц үнэ" },
];

export const products: Product[] = [
  {
    id: 1,
    name: "Кемпинг майхан 4 хүний",
    category: "camping",
    description:
      "Хөнгөн, тогтвортой 4 улирлын майхан. Усны тусгаарлалттай, шуурганд тэсвэртэй.",
    price: 180000,
    originalPrice: 220000,
    image:
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80",
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80",
      "https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?w=800&q=80",
    ],
    rating: 4.8,
    reviewCount: 43,
    stock: 12,
    tags: ["4 хүн", "Усны тусгаарлалт", "Хөнгөн"],
    isSale: true,
    isFeatured: true,
  },
  {
    id: 2,
    name: "Унтлагын уут −10°C",
    category: "camping",
    description: "Хүйтэн шөнөд дулаан байлгах нягт дүүргэлттэй унтлагын уут.",
    price: 95000,
    image:
      "https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=600&q=80",
    rating: 4.6,
    reviewCount: 28,
    stock: 8,
    tags: ["−10°C", "Дулаан", "Компакт"],
    isNew: true,
  },
  {
    id: 3,
    name: "Кемпинг сандал & ширээний иж",
    category: "camping",
    description:
      "Хялбар угсардаг, хөнгөн хавтгайруулах боломжтой алюмин иж бүрдэл.",
    price: 75000,
    image:
      "https://images.unsplash.com/photo-1600456899121-68eda5705257?w=600&q=80",
    rating: 4.5,
    reviewCount: 61,
    stock: 20,
    tags: ["4 сандал", "1 ширээ", "Алюмин"],
  },
  {
    id: 4,
    name: "Нүүрсний барбекю тогоо XL",
    category: "bbq",
    description:
      "Өргөн хэмжээтэй нүүрсний барбекю тогоо. Гэр бүлийн том цуглааны хэмжээний.",
    price: 120000,
    originalPrice: 145000,
    image:
      "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&q=80",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    ],
    rating: 4.9,
    reviewCount: 87,
    stock: 5,
    tags: ["XL хэмжээ", "Нүүрс", "Тохируулагч агаар"],
    isSale: true,
    isFeatured: true,
  },
  {
    id: 5,
    name: "Газрын тосны барбекю тогоо",
    category: "bbq",
    description:
      "2 бортого хавтантай газрын тосны барбекю. Хурдан халах, тохируулахад хялбар.",
    price: 89000,
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
    rating: 4.7,
    reviewCount: 52,
    stock: 14,
    tags: ["Газрын тос", "2 хавтан", "Хурдан халах"],
  },
  {
    id: 6,
    name: "Барбекюний хэрэгслийн иж",
    category: "bbq",
    description:
      "18 ширхэг мэргэжлийн барбекю хэрэгсэл оролцсон гангаар хийсэн иж бүрдэл.",
    price: 45000,
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80",
    rating: 4.4,
    reviewCount: 34,
    stock: 30,
    tags: ["18 ширхэг", "Ган", "Чемоданттай"],
  },
  {
    id: 7,
    name: "Кемпинг гал тогооны иж",
    category: "kitchen",
    description:
      "Зөөврийн 10 ширхэгтэй гал тогооны иж. Хөнгөн хайлш материалаар хийгдсэн.",
    price: 68000,
    originalPrice: 85000,
    image:
      "https://images.unsplash.com/photo-1520984032042-162d526883e0?w=600&q=80",
    rating: 4.6,
    reviewCount: 39,
    stock: 18,
    tags: ["10 ширхэг", "Хөнгөн хайлш", "Зөөврийн"],
    isSale: true,
  },
  {
    id: 8,
    name: "Термос 1.5л гадаатай",
    category: "kitchen",
    description:
      "Вакуум тусгаарлалттай бат бэх термос. 24 цаг дулаан, 18 цаг хүйтэн байлгана.",
    price: 35000,
    image:
      "https://images.unsplash.com/photo-1544819667-9bfc1de23d4e?w=600&q=80",
    rating: 4.8,
    reviewCount: 112,
    stock: 50,
    tags: ["1.5 литр", "24 цаг дулаан", "Ган"],
    isNew: true,
  },
  {
    id: 9,
    name: "Зөөврийн хөргөгч 25л",
    category: "kitchen",
    description:
      "Мөстэй ажиллах чадалтай 25 литрийн зөөврийн хөргөгч. Хатуу хана, нягт таг.",
    price: 55000,
    image:
      "https://images.unsplash.com/photo-1595781572981-d63151b232ed?w=600&q=80",
    rating: 4.5,
    reviewCount: 24,
    stock: 7,
    tags: ["25 литр", "Мөст", "Хатуу хана"],
  },
  {
    id: 10,
    name: "Нарны панел 100W зөөврийн",
    category: "power",
    description:
      "Хэврэлтэй нарны панел. Утас, зөөврийн компьютер, гэрэл цэнэглэнэ.",
    price: 195000,
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80",
      "https://images.unsplash.com/photo-1611365892117-00ac5ef43c90?w=800&q=80",
    ],
    rating: 4.7,
    reviewCount: 19,
    stock: 9,
    tags: ["100W", "Хэврэлт", "USB-C + A"],
    isFeatured: true,
    isNew: true,
  },
  {
    id: 11,
    name: "Зөөврийн цахилгаан станц 500Wh",
    category: "power",
    description:
      "Гэрэл, утас, зөөврийн компьютер бүгдийг цэнэглэх хүчирхэг зөөврийн батарей.",
    price: 450000,
    originalPrice: 520000,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    rating: 4.9,
    reviewCount: 31,
    stock: 4,
    tags: ["500Wh", "AC+DC+USB", "MPPT цэнэглэгч"],
    isSale: true,
  },
  {
    id: 12,
    name: "Биоорчинд хайрагдах ариутгалын иж",
    category: "hygiene",
    description:
      "Байгальд аюулгүй кемпинг ариун цэврийн иж. Цаас, ариутгагч, уут багтсан.",
    price: 18000,
    image:
      "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&q=80",
    rating: 4.3,
    reviewCount: 56,
    stock: 100,
    tags: ["Байгальд ээлтэй", "Иж бүрэн", "Компакт"],
  },
];
