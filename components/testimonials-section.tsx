"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Манай байгууллага олон жилийн турш зуслангийн байрны тохижилтод хамтран ажиллаж байна. Порталын систем нь ажлыг хялбарчилж, хэрэглэгчдэд шууд хүрэх боломж олгож байгаа нь үнэхээр таалагддаг.",
    name: "Наран Тавилгат",
    role: "ХХК",
  },
  {
    quote:
      "Эндээс түрээслэгчидтэй хурдан холбогдох, байршил, үнэ, мэдээллийг ил тод харуулах боломжтой. Манай үйлчлүүлэгчдийн сэтгэл ханамж дээшилсэн.",
    name: "Тэрэлж Тур",
    role: "ХХК",
  },
  {
    quote:
      "Зуслангийн засвар, барилгын үйлчилгээ үзүүлэгчийн хувьд энэхүү платформтой хамтран ажиллах нь маш үр дүнтэй. Бидний үйлчилгээ хэрэглэгчдэд шууд хүрч байна.",
    name: "Сэргэлэн Барилга",
    role: "ХХК",
  },
];

export function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const scroll = () => {
      scrollPosition += scrollSpeed;

      if (
        scrollContainer.scrollWidth &&
        scrollPosition >= scrollContainer.scrollWidth / 2
      ) {
        scrollPosition = 0;
      }

      scrollContainer.scrollLeft = scrollPosition;
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 text-balance">
          Хамтрагч байгууллагуудын сэтгэгдэл
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto text-pretty leading-relaxed">
          Манай платформтой хамтран ажиллаж буй байгууллагуудын бодит үнэлгээ,
          туршлага. Бидний үйлчилгээний чанар, найдвартай байдлыг тэдний
          сэтгэгдлээс харна уу.
        </p>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-hidden"
            style={{ scrollBehavior: "auto" }}
          >
            {/* Duplicate testimonials for seamless loop */}
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <Card
                key={index}
                className="shrink-0 w-[90vw] sm:w-112.5 border-none shadow-lg flex flex-col justify-between"
              >
                <CardContent className="p-8">
                  <Quote className="h-8 w-8 text-primary mb-4" />
                  <p className="text-base sm:text-lg mb-6 leading-relaxed text-pretty min-h-30">
                    {testimonial.quote}
                  </p>
                  <div>
                    <p className="font-semibold text-lg">{testimonial.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
