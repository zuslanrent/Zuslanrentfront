"use client";

import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { QuoteFormDialog } from "@/components/quote-form-dialog";

const pricingTiers = [
  {
    name: "Coffee Shop",
    price: "",
    image: "/images/ser1.jpg",
    features: [
      "Нэг аяга кофегоор өдрийг эхлүүлээрэй",
      "Амт, тав тух, эрч хүч нэг дор",
      "Жинхэнэ кофены соёл энд төрнө",
      "Тухтай буландаа тайвширч, кофе уугаарай",
      "Шинэ өдөр, шинэ амт, шинэ энерги",
    ],
    highlighted: false,
  },
  {
    name: "Lotte Mart",
    price: "",
    image: "/images/ser2.jpg",
    features: [
      "Шинэхэн бүтээгдэхүүн",
      "Нэг дороос",
      "Өргөн сонголт",
      "Хямдрал ихтэй",
      "Цаг хэмнэ",
      "Таны гэр бүлийн өдөр тутмын супермаркет",
    ],
    highlighted: true,
  },
  {
    name: "Paint Shop",
    price: "",
    image: "/images/ser3.jpg",
    features: [
      "Өнгө бүрийн чанартай будаг",
      "Шинэхэн будаг, мэргэжлийн хэрэгсэл",
      "Хямд үнэ",
      "Чанартай импорт будаг ихтэй",
      "Мэргэжлийн зөвлөгөө",
    ],
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section
      id="pakketten"
      className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Хамгийн ойр худалдааны газрууд
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-balance">
            Өөрт ойрхон <span className="text-primary">үйлчилгээний</span>{" "}
            газрууд
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Таны зуслангийн байранд ойр байрлах дэлгүүр, кафе, засвар үйлчилгээ
            болон бусад хэрэгцээт газруудыг нэг дороос хялбархан олоорой.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingTiers.map((tier, index) => (
            <Card
              key={index}
              className={`relative group overflow-hidden border-0 ${
                tier.highlighted ? "scale-105 shadow-xl" : ""
              } transition-all duration-300 cursor-pointer`}
              style={{ minHeight: "420px" }}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${tier.image})` }}
              />

              {/* Default overlay — гарчиг, үнэ */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 transition-opacity duration-300 group-hover:opacity-0" />

              {/* Hover overlay — бүх мэдээлэл */}
              <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Highlighted badge */}
              {tier.highlighted && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold shadow-lg whitespace-nowrap">
                  ⭐ Сүүлд нэмэгдсэн
                </div>
              )}

              {/* Default state — доод хэсэгт гарчиг, үнэ */}
              <div className="absolute bottom-0 left-0 right-0 z-10 p-6 transition-opacity duration-300 group-hover:opacity-0">
                <p className="text-white/70 text-sm mb-1">
                  {tier.price === "Op aanvraag" ? "" : ""}
                </p>
                <h3 className="text-white text-2xl font-bold">{tier.name}</h3>
                <p className="text-white text-3xl font-bold mt-1">
                  {tier.price}
                </p>
              </div>

              {/* Hover state — бүтэн контент */}
              <div className="absolute inset-0 z-10 flex flex-col justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-white text-2xl font-bold mb-1">
                  {tier.name}
                </h3>
                <p className="text-white/80 text-xl font-semibold mb-5">
                  {tier.price}
                </p>

                <ul className="space-y-2 mb-6">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-white/90 text-sm leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <QuoteFormDialog
                  packageName={tier.name}
                  variant={tier.highlighted ? "default" : "outline"}
                  className={`w-full ${tier.highlighted ? "shadow-lg shadow-primary/20" : "border-white text-white hover:bg-white hover:text-black"}`}
                >
                  {tier.price === "Op aanvraag"
                    ? "Neem Contact Op"
                    : ""}
                </QuoteFormDialog>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Та өөрт хамгийн ойр{" "}
            <span className="text-primary font-semibold">
              байрлах үйлчилгээний
            </span>{" "}
            төвүүдээр{" "}
            <span className="text-primary font-semibold">үйлчлүүлээрэй</span>
          </p>
        </div>
      </div>
    </section>
  );
}
