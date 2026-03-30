"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "Богдхан орчмын зуслан",
    category: "120 м², 3 өрөө, 2 ариун цэврийн өрөө",
    image: "/images/house1.jpg",
    description:
      "Гал тогоо бүрэн тоноглогдсон, том цэцэрлэгтэй, автомашины зогсоолтой",
    tags: ["9900-1234", "150,000₮/өдөр"],
  },
  {
    title: "Сэргэлэн тосгон",
    category: "45 м², 1 өрөө",
    image: "/images/house2.jpg",
    description:
      "Сайхан цонхны нар, жижиг тагттай, гэрийн хүнд зориулсан тавилга",
    tags: ["9955-5678", "80,000₮/өдөр"],
  },
  {
    title: "Тэрэлж, ой модны орчим",
    category: "90 м², 2 өрөө, 1 ариун цэврийн өрөө",
    image: "/images/house3.jpg",
    description: "Барбекюны талбай, тоглоомын талбай, цэвэрхэн гал тогоо",
    tags: ["9911-3344", "120,000₮/өдөр"],
  },
  {
    title: "Улиастай, усан сангийн ойролцоо",
    category: "200 м², 4 өрөө, 3 ариун цэврийн өрөө",
    image: "/images/house4.jpg",
    description:
      "Усны саун, том цэцэрлэг, автомашины зогсоол, гал тогоо бүрэн тоноглогдсон",

    tags: ["9909-7788", "300,000₮/өдөр"],
  },
];

export function PortfolioSection() {
  return (
    <section id="portfolio" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance">
            Түрээсийн зарууд
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Зуслангийн байрны шинэ, идэвхтэй түрээсийн заруудыг нэг дороос
            хялбархан үзэх боломжтой. Байршил, үнэ, багтаамж, тохижилтоор шүүлт
            хийж өөрт тохирох байрыг хурдан олоорой.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="relative overflow-hidden aspect-video flex">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="block w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background/95 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <Button size="sm" variant="secondary" className="gap-2">
                    Дэлгэрэнгүй үзэх <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-sm text-primary font-semibold mb-2">
                  {project.category}
                </p>
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center py-12">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg group shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
            asChild
          >
            <a href="/">
              Бүх зар үзэх
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
