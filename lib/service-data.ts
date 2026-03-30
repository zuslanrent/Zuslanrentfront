import {
  Home, Tent, TreePine, Waves, Mountain,
  Utensils, Shield, HeartHandshake, MapPin, Clock,
} from "lucide-react";

export type ServiceCategory = {
  id:    string;
  icon:  React.ElementType;
  label: string;
  color: string;
  bg:    string;
};

export type Service = {
  id:          number;
  categoryId:  string;
  title:       string;
  description: string;
  features:    string[];
  price:       string;
  duration:    string;
  rating:      number;
  reviewCount: number;
  available:   boolean;
  image:       string;
  images?:     string[];
};

export const serviceCategories: ServiceCategory[] = [
  { id:"all",       icon:Home,      label:"Бүгд",           color:"text-primary",     bg:"bg-primary/10"                     },
  { id:"rental",    icon:Tent,      label:"Түрээс",         color:"text-amber-600",   bg:"bg-amber-50 dark:bg-amber-950/30"  },
  { id:"nature",    icon:TreePine,  label:"Байгаль",        color:"text-emerald-600", bg:"bg-emerald-50 dark:bg-emerald-950/30"},
  { id:"water",     icon:Waves,     label:"Усны үйлчилгээ", color:"text-blue-600",    bg:"bg-blue-50 dark:bg-blue-950/30"    },
  { id:"adventure", icon:Mountain,  label:"Аялал",          color:"text-orange-600",  bg:"bg-orange-50 dark:bg-orange-950/30"},
  { id:"food",      icon:Utensils,  label:"Хоол",           color:"text-rose-600",    bg:"bg-rose-50 dark:bg-rose-950/30"    },
  { id:"extra",     icon:Shield,    label:"Нэмэлт",         color:"text-violet-600",  bg:"bg-violet-50 dark:bg-violet-950/30"},
];

export const services: Service[] = [
  {
    id:1, categoryId:"rental",
    title:"Зуслангийн байр түрээслэх",
    description:"Өрх гэртээ тохиромжтой зуслангийн байр түрээслэх бүрэн үйлчилгээ. Байршил сонгохоос эхлээд гэрээ байгуулах хүртэл туслана.",
    features:["Байр сонгоход туслах","Гэрээ байгуулах","Орон нутгийн зөвлөгөө","24/7 дэмжлэг"],
    price:"Үнэгүй", duration:"1–2 өдөр", rating:4.9, reviewCount:128, available:true,
    image:"https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80",
    images:[
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80",
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    ],
  },
  {
    id:2, categoryId:"rental",
    title:"Байр зарлах үйлчилгээ",
    description:"Өөрийн зуслангийн байрыг манай платформд зарлаж, олон тооны хэрэглэгчдэд хүрнэ. Мэргэжлийн зураг авалт, тайлбар бичих туслалцаа.",
    features:["Мэргэжлийн зураг авалт","Зар бичих туслалцаа","Үнэ тогтоох зөвлөгөө","Хариу мессеж"],
    price:"15,000₮", duration:"1 сар", rating:4.8, reviewCount:94, available:true,
    image:"https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80",
  },
  {
    id:3, categoryId:"nature",
    title:"Ойн аялал хөтөч",
    description:"Мэргэжлийн байгаль судлаачтай хамт ойн аялал хийж, байгалийн нууцыг задлаарай. Аюулгүй байдал, танин мэдэхүйн хосолсон аялал.",
    features:["Мэргэжлийн хөтөч","Аюулгүй тоног төхөөрөмж","Ургамал амьтан судлал","Гэрэл зургийн туслалцаа"],
    price:"45,000₮", duration:"Өдрийн аялал", rating:4.7, reviewCount:67, available:true,
    image:"https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
    images:[
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
      "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&q=80",
    ],
  },
  {
    id:4, categoryId:"nature",
    title:"Одон оронгийн ажиглалт",
    description:"Гэрлийн бохирдолгүй нутагт мэргэжлийн дурангаар тэнгэрийн биетүүдийг ажиглах. Астрономич хөтөчтэй.",
    features:["Мэргэжлийн дуран","Астрономич хөтөч","Зөөврийн тавцан","Халуун ундаа оролцоно"],
    price:"35,000₮", duration:"3–4 цаг (шөнө)", rating:4.9, reviewCount:43, available:true,
    image:"https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80",
    images:[
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    ],
  },
  {
    id:5, categoryId:"water",
    title:"Загасчлалын тоног хангамж",
    description:"Загасчлалд шаардлагатай бүх тоног төхөөрөмжийг түрээслэх. Анхлан суралцагчдад зориулсан заавар зөвлөгөө орно.",
    features:["Загасчлалын бүх хэрэгсэл","Эхлэгчдэд заавар","Байршлын зөвлөгөө","Загасны тайлан"],
    price:"20,000₮", duration:"Өдрийн", rating:4.6, reviewCount:82, available:true,
    image:"https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    images:[
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
      "https://images.unsplash.com/photo-1468581264429-2548ef9eb732?w=800&q=80",
    ],
  },
  {
    id:6, categoryId:"water",
    title:"Усан спортын үйлчилгээ",
    description:"Нуурт зориулсан kayak, SUP board, завь зэрэг усан спортын хэрэгсэл түрээслэх болон зааварлах.",
    features:["Kayak, SUP board","Аюулгүйн хантааз","Зааварлагч","Дасгалжуулалт"],
    price:"30,000₮", duration:"2 цаг", rating:4.8, reviewCount:56, available:false,
    image:"https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?w=800&q=80",
    images:[
      "https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?w=800&q=80",
      "https://images.unsplash.com/photo-1530053969600-caed2596d242?w=800&q=80",
    ],
  },
  {
    id:7, categoryId:"adventure",
    title:"Уулын дугуйн аялал",
    description:"Уул, ойн замаар Mountain bike-аар аялах. Бүх түвшний жолоочдод тохиромжтой маршрутуудтай.",
    features:["Чанартай дугуй","Дуулга, хамгаалалт","Маршрутын зураглал","Туслах жолооч"],
    price:"25,000₮", duration:"Хагас өдөр", rating:4.7, reviewCount:38, available:true,
    image:"https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=800&q=80",
    images:[
      "https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    ],
  },
  {
    id:8, categoryId:"adventure",
    title:"Морин аялал",
    description:"Монгол нутгийн уламжлалт морин аялал. Туршлагатай морьчин хөтөчтэй хамт байгаль дунд сайхан цагийг өнгөрүүлэх.",
    features:["Сайн сурагдсан морь","Морьчин хөтөч","Аюулгүйн бэлтгэл","Уламжлалт хувцас"],
    price:"50,000₮", duration:"Өдрийн аялал", rating:4.9, reviewCount:71, available:true,
    image:"https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&q=80",
    images:[
      "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&q=80",
      "https://images.unsplash.com/photo-1534187886935-1e1236e856c3?w=800&q=80",
      "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=800&q=80",
    ],
  },
  {
    id:9, categoryId:"food",
    title:"Барбекю & Гал тогооны үйлчилгээ",
    description:"Байгалийн орчинд барбекю хийх бүрэн тоног хэрэгсэл, мах, хүнс хангамжтай. Захиалгаар тогооч ирүүлэх боломжтой.",
    features:["Барбекю тоног","Мах, хүнс сонголт","Захиалгат тогооч","Цэвэрлэгээ хамт"],
    price:"40,000₮+", duration:"Вечерийн", rating:4.8, reviewCount:115, available:true,
    image:"https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    images:[
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
      "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80",
      "https://images.unsplash.com/photo-1464093515883-ec948246accb?w=800&q=80",
    ],
  },
  {
    id:10, categoryId:"food",
    title:"Пикникийн багц",
    description:"Гэр бүл, найзуудтайгаа байгальд пикник хийхэд бүрэн бэлэн багц. Хүнс, суудал, чимэглэл бүгд орно.",
    features:["Гар хийцийн хоол","Суудал, ширээ","Чимэглэл","Хог цэвэрлэгээ"],
    price:"60,000₮", duration:"Өдрийн", rating:4.7, reviewCount:49, available:true,
    image:"https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=800&q=80",
    images:[
      "https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=800&q=80",
      "https://images.unsplash.com/photo-1506368083636-6defb67639ab?w=800&q=80",
    ],
  },
  {
    id:11, categoryId:"extra",
    title:"Тээвэр & Хүргэлт",
    description:"Хот болон зуслангийн байр хооронд тохиромжтой тээврийн үйлчилгээ. Бүлэг болон хувиараа захиалах боломжтой.",
    features:["Хот–зуслан маршрут","Тав тухтай тээвэр","Захиалгат цаг","Ачаа зөөх"],
    price:"20,000₮+", duration:"Нэг талын", rating:4.6, reviewCount:203, available:true,
    image:"https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80",
  },
  {
    id:12, categoryId:"extra",
    title:"Гэрийн тэжээвэр амьтантай",
    description:"Нохой, муур зэрэг тэжээвэр амьтантай ирэх боломжтой тусгай байрнуудыг олоход туслах үйлчилгээ.",
    features:["Pet-friendly байр хайх","Тэжээвэр хоол","Явах талбай","Мал эмч зөвлөгөө"],
    price:"Үнэгүй", duration:"Байнга", rating:4.5, reviewCount:37, available:true,
    image:"https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80",
  },
];

export const serviceStats = [
  { icon:Home,           value:"200+",   label:"Идэвхтэй байр"               },
  { icon:HeartHandshake, value:"1,500+", label:"Сэтгэл ханасан үйлчлүүлэгч"  },
  { icon:MapPin,         value:"45+",    label:"Байршил"                     },
  { icon:Clock,          value:"24/7",   label:"Дэмжлэг"                    },
];