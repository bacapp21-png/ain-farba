import { useState } from "react";
import { Link } from "wouter";
import { useListNotables } from "@workspace/api-client-react";
import { ListNotablesSpecialty } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { specialtyTranslations } from "@/lib/translations";
import { Button } from "@/components/ui/button";

export default function Notables() {
  const [activeSpecialty, setActiveSpecialty] = useState<ListNotablesSpecialty | undefined>();
  const { data: notables, isLoading } = useListNotables(
    activeSpecialty ? { specialty: activeSpecialty } : {}
  );

  const specialties = Object.values(ListNotablesSpecialty);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">أعلام المنطقة</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          تعرف على الشخصيات البارزة من علماء وفقهاء وشعراء ومفكرين أثروا تاريخ المنطقة.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-12">
        <Button
          variant={!activeSpecialty ? "default" : "outline"}
          onClick={() => setActiveSpecialty(undefined)}
          className="rounded-full px-6"
        >
          الكل
        </Button>
        {specialties.map((specialty) => (
          <Button
            key={specialty}
            variant={activeSpecialty === specialty ? "default" : "outline"}
            onClick={() => setActiveSpecialty(specialty)}
            className="rounded-full px-6"
          >
            {specialtyTranslations[specialty] || specialty}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-80 rounded-xl" />
          ))}
        </div>
      ) : notables && notables.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {notables.map((notable) => (
            <Link key={notable.id} href={`/notables/${notable.id}`}>
              <Card className="h-full hover:shadow-xl transition-all hover:-translate-y-1 group bg-card border-primary/10 overflow-hidden">
                <div className="aspect-[4/5] bg-muted relative overflow-hidden">
                  {notable.imageUrl ? (
                    <img src={notable.imageUrl} alt={notable.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary/20">
                      <span className="text-6xl font-serif font-bold">{notable.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <span className="inline-block px-2 py-1 bg-accent text-accent-foreground text-xs font-bold rounded mb-2">
                      {specialtyTranslations[notable.specialty] || notable.specialty}
                    </span>
                    <h3 className="text-xl font-bold font-serif leading-tight">{notable.name}</h3>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-primary mb-2">{notable.role}</p>
                  {notable.era && <p className="text-xs text-muted-foreground">{notable.era}</p>}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-xl border-2 border-dashed border-primary/20">
          <p className="text-xl text-muted-foreground">لا توجد شخصيات في هذا القسم حالياً.</p>
        </div>
      )}
    </div>
  );
}