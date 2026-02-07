import React, { useState } from 'react';
import GetHelpSection from '../components/GetHelpSection';
import { LifeBuoy, AlertCircle, Phone, Globe, ChevronDown, X } from 'lucide-react';
import { EMERGENCY_CONTACTS } from '../data/emergencyContacts';

const GetHelp: React.FC = () => {
  const [showEmergency, setShowEmergency] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("US");

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <LifeBuoy className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Resource Navigator</h1>
          </div>
          <p className="text-slate-400 max-w-2xl leading-relaxed">
            Access verified public health services, legal support, and medical assistance. 
            Use the location selector to find resources tailored to your region and status.
          </p>
        </div>
        
        <button 
          onClick={() => setShowEmergency(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-semibold hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-lg shadow-red-900/10 whitespace-nowrap"
        >
          <AlertCircle className="w-5 h-5" />
          Emergency help
        </button>
      </div>

      <GetHelpSection />

      <div className="mt-12 p-6 rounded-xl bg-slate-900/50 border border-slate-800">
        <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">Frequently Asked Questions</h3>
        <div className="grid md:grid-cols-2 gap-8">
           <div>
              <h4 className="text-blue-400 text-sm font-semibold mb-2">Is my data shared?</h4>
              <p className="text-xs text-slate-500">
                No. This platform is a static resource directory. Your location selections are kept locally in your browser session and are never sent to a server.
              </p>
           </div>
           <div>
              <h4 className="text-blue-400 text-sm font-semibold mb-2">What if my location isn't listed?</h4>
              <p className="text-xs text-slate-500">
                We have resources for United States (California, Florida), Brazil, Iran, Gaza/Palestine, Ukraine, and Venezuela. Select "Other (Global)" for WHO and UNAIDS guidelines.
              </p>
           </div>
        </div>
      </div>

      {/* Emergency Modal */}
      {showEmergency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-red-900/50 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative">
            
            {/* Modal Header */}
            <div className="p-6 bg-red-950/20 border-b border-red-900/30 flex justify-between items-start">
               <div>
                 <h2 className="text-xl font-bold text-white flex items-center gap-2">
                   <AlertCircle className="w-6 h-6 text-red-500" />
                   Emergency Support
                 </h2>
                 <p className="text-red-200/80 text-sm mt-2 leading-relaxed">
                   If you are in immediate danger or considering self-harm, please seek urgent help now.
                 </p>
               </div>
               <button onClick={() => setShowEmergency(false)} className="text-slate-400 hover:text-white transition-colors">
                 <X className="w-6 h-6" />
               </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
               <div className="mb-6">
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Country</label>
                 <div className="relative">
                    <select 
                      value={selectedCountry} 
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="w-full appearance-none bg-slate-950 text-slate-200 text-sm pl-10 pr-4 py-3 rounded-lg border border-slate-700 focus:border-red-500 outline-none"
                    >
                       <option value="US">United States</option>
                       <option value="BR">Brazil</option>
                       <option value="GLOBAL">Global / Other</option>
                    </select>
                    <Globe className="absolute left-3 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
                    <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                 </div>
               </div>

               <div className="space-y-3">
                  {(EMERGENCY_CONTACTS[selectedCountry] || EMERGENCY_CONTACTS["GLOBAL"]).services.map((service, idx) => (
                    <a 
                      key={idx}
                      href={`tel:${service.phone}`}
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 hover:bg-red-900/20 border border-slate-700 hover:border-red-500/50 transition-all group"
                    >
                       <div>
                         <div className="font-bold text-slate-200 group-hover:text-red-100">{service.name}</div>
                         <div className="text-xs text-slate-500 mt-0.5">Tap to call</div>
                       </div>
                       <div className="flex items-center gap-2 text-xl font-mono font-bold text-red-400 group-hover:text-red-300">
                         <Phone className="w-5 h-5" />
                         {service.phone}
                       </div>
                    </a>
                  ))}
               </div>
               
               <p className="mt-6 text-xs text-slate-500 text-center leading-relaxed">
                 If your country is not listed above, please dial your local emergency services number (e.g., 911, 112, 999) or proceed to the nearest emergency room.
               </p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default GetHelp;