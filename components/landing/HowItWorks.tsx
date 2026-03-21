import { Wand2, Video, BarChart3, CheckCircle2 } from "lucide-react";

export default function HowItWorks() {
  const steps = [ 
    { 
      num: "01", 
      title: "Give Reelio a prompt", 
      desc: "Type in a topic, paste a blog post URL, or upload a rough script. Our AI engine understands context and writes a highly engaging viral hook instantly.", 
      icon: <Wand2 className="w-6 h-6" /> 
    },
    { 
      num: "02", 
      title: "Review & Customize", 
      desc: "Reelio generates the visual assets, dynamic captions, and professional AI voiceover. You can make quick edits into our intuitive timeline editor.", 
      icon: <Video className="w-6 h-6" /> 
    },
    { 
      num: "03", 
      title: "Auto-Schedule everywhere", 
      desc: "Select your connected platforms (YouTube, IG, TikTok, Email) and choose a date. Reelio optimizes formats and posts for you automatically.", 
      icon: <BarChart3 className="w-6 h-6" /> 
    },
  ];

  return (
    <section id="how-it-works" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">From idea to viral in 3 steps</h2>
        </div>

        <div className="space-y-24">
          {steps.map((step, idx) => (
            <div key={idx} className={`flex flex-col md:flex-row gap-12 items-center ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 font-bold text-xl text-purple-400">
                  {step.num}
                </div>
                <h3 className="text-3xl font-bold">{step.title}</h3>
                <p className="text-lg text-slate-400 leading-relaxed max-w-lg">{step.desc}</p>
                <ul className="pt-4 space-y-3">
                  <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-purple-500"/> Effortless generation</li>
                  <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-purple-500"/> High retention design</li>
                </ul>
              </div>
              <div className="flex-1 w-full relative">
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 border border-white/10 p-2 shadow-2xl overflow-hidden group">
                    {/* Mock step graphic */}
                    <div className="w-full h-full rounded-xl border border-white/5 bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                      <div className="w-20 h-20 rounded-2xl bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 mb-4 group-hover:scale-110 transition-transform duration-500">
                        {step.icon}
                      </div>
                      <div className="h-4 w-1/3 bg-white/10 rounded mb-2"></div>
                      <div className="h-3 w-1/2 bg-white/5 rounded"></div>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
