"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Blocks,
  ChevronsLeftRightEllipsis,
  HousePlusIcon,
  HousePlug,
  Sofa,
  Shield,
} from "lucide-react";

const services = [
  {
    icon: Blocks,
    title: "Засвар, тохижилтын үйлчилгээ",
    description:
      "Зуслангийн байшингийн дотор, гадна засвар болон бүрэн тохижилтын ажлыг мэргэжлийн түвшинд гүйцэтгэнэ.",
  },
  {
    icon: ChevronsLeftRightEllipsis,
    title: "Хашаа, гадаа байгууламж",
    description:
      "Хашаа барих, засах, гадна орчныг тохижуулах бүх төрлийн ажлыг найдвартай хийж гүйцэтгэнэ.",
  },
  {
    icon: HousePlusIcon,
    title: "Сүүдрэвч, саравч угсралт",
    description:
      "Гадаа амрах орчныг бүрдүүлэх сүүдрэвч, саравчийг чанартай угсарч суурилуулна.",
  },
  {
    icon: HousePlug,
    title: "Цэвэрлэгээ, арчилгаа",
    description:
      "Зуслангийн байр болон гадна орчны их цэвэрлэгээ, тогтмол арчилгааны үйлчилгээ.",
  },
  {
    icon: Sofa,
    title: "Тавилга, интерьер шийдэл",
    description:
      "Зуслангийн байранд тохирсон тавилга, интерьерийн шийдлийг санал болгож, суурилуулалт хийнэ.",
  },
  {
    icon: Shield,
    title: "Харуул хамгаалалт",
    description:
      "Зуслангийн байрны аюулгүй байдлыг хангах харуул, хамгаалалтын найдвартай үйлчилгээ.",
  },
];

export function ServicesSection() {
  return (
    <section
      id="diensten"
      className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/5 animate-pulse" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mx-auto block w-fit">
          ✨ Үйлчилгээ сервисүүд
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 text-balance">
          Бидэнтэй <span className="text-primary">хамтрагч</span> үйлчилгээнүүд
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto text-pretty leading-relaxed text-lg">
          Зуслангаа тохижуулах, засах, сайжруулах бүх төрлийн мэргэжлийн
          үйлчилгээ.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-background/50 backdrop-blur-sm"
            >
              <CardHeader>
                <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <service.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
