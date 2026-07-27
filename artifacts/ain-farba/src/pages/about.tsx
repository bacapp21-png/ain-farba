import logoUrl from "@assets/2d137bf4-fcec-4423-89e3-894b9e8e6144_1778318301241.jpeg";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-16">
        <div className="inline-block mb-6 p-2 rounded-full border-4 border-primary/10">
          <img src={logoUrl} alt="شعار ذاكرة عين فربة" className="w-32 h-32 rounded-full object-cover" />
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-4">
          ذاكرة عين فربة
        </h1>
        <p className="text-2xl font-serif text-accent font-bold mb-8">
          وحدة • ثقافة • بناء
        </p>
      </div>

      <div className="space-y-12">
        <section className="bg-card p-8 rounded-2xl border shadow-sm">
          <h2 className="text-3xl font-serif font-bold text-primary mb-6 border-b pb-4">من نحن؟</h2>
          <div className="prose prose-lg prose-stone max-w-none leading-relaxed">
            <p>
              منصة متخصصة في توثيق التراث الثقافي والتاريخي، والتعريف بالمقومات السياحية، وإبراز المعالم الطبيعية والحضارية، ونشر الفكر والأدب، والتعريف بالأعلام والشخصيات البارزة بمنطقة عين فربة في موريتانيا.
            </p>
            <p>
              نؤمن بأن الذاكرة الثقافية هي الأساس الذي تبنى عليه الأجيال القادمة، ولذلك نسعى لتوثيق ورقمنة المخطوطات، وتدوين التاريخ الشفوي، والتعريف بأعلام المنطقة وعلمائها، ونشر إنتاجهم الفكري والأدبي.
            </p>
          </div>
        </section>

        <section className="bg-primary text-primary-foreground p-8 rounded-2xl shadow-md">
          <h2 className="text-3xl font-serif font-bold mb-6 border-b border-primary-foreground/20 pb-4">منطقة عين فربة</h2>
          <div className="prose prose-lg prose-invert max-w-none leading-relaxed">
            <p>
              عين فربة هي إحدى المراكز الثقافية والعلمية الهامة في موريتانيا. تتميز بتاريخها العريق ومساهمتها الفاعلة في نشر العلم والأدب. لقد أنجبت المنطقة العديد من العلماء والفقهاء والشعراء الذين تركوا بصمات واضحة في الثقافة الموريتانية والإسلامية.
            </p>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-xl border text-center">
            <div className="text-4xl mb-4 text-accent">وحدة</div>
            <p className="text-muted-foreground">توحيد جهود أبناء المنطقة وتعزيز أواصر التآخي والتعاون بينهم.</p>
          </div>
          <div className="bg-card p-6 rounded-xl border text-center">
            <div className="text-4xl mb-4 text-accent">ثقافة</div>
            <p className="text-muted-foreground">إحياء التراث الثقافي للمنطقة وحفظه من الاندثار ونقله للأجيال.</p>
          </div>
          <div className="bg-card p-6 rounded-xl border text-center">
            <div className="text-4xl mb-4 text-accent">بناء</div>
            <p className="text-muted-foreground">المساهمة الفاعلة في التنمية المحلية وبناء قدرات الشباب.</p>
          </div>
        </section>
      </div>
    </div>
  );
}