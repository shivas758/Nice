import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const resourceSections = [
  {
    key: "embassy-contacts",
    label: "Embassy Emergency Contacts",
  },
  {
    key: "embassy-info",
    label: "Indian Embassies and Consulates Information",
  },
  {
    key: "associations",
    label: "Indian Associations in Gulf",
  },
  {
    key: "healthcare",
    label: "Health Care",
  },
  {
    key: "legal",
    label: "Legal",
  },
  {
    key: "insurance",
    label: "Insurance",
  },
  {
    key: "pre-departure",
    label: "Pre-departure best practices",
  },
  {
    key: "post-arrival",
    label: "Post arrival Best Practices",
  },
  {
    key: "female-domestic-workers",
    label: "Advise for Female Domestic Workers",
  },
  {
    key: "arabic-words",
    label: "Important Arabic words in Indian Languages",
  },
  {
    key: "contact-nice",
    label: "Contact NICE",
  },
];

const sectionDetails: Record<string, React.ReactNode> = {
  "embassy-contacts": (
    <div>
      <h3 className="font-semibold mb-2">Embassy Emergency Contacts</h3>
      <table className="w-full text-sm border mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Country Name</th>
            <th className="border px-2 py-1">Description</th>
            <th className="border px-2 py-1">Phone Number(s)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-2 py-1">UAE (Dubai)</td>
            <td className="border px-2 py-1">Consulate General of India in Dubai: toll-free helpline, chargeable number, Women/Housemaids distress line</td>
            <td className="border px-2 py-1">800-46342 (800 INDIA, toll-free), 00971504559594 (chargeable), 02-4492700 Ext. 260, 0502103813</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">UAE (Abu Dhabi)</td>
            <td className="border px-2 py-1">Helpline numbers for Indian community</td>
            <td className="border px-2 py-1">00-971-1-4492700, 8004632 (800 India, toll-free)</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">Saudi Arabia (Riyadh)</td>
            <td className="border px-2 py-1">Embassy of India, Riyadh: 24x7 Helpline Pravasi Bhartiya Seva Kendra (PBSK), WhatsApp, toll-free</td>
            <td className="border px-2 py-1">00-966-11-4884697, 00-966-542126748 (WhatsApp), 800 247 1234 (toll-free)</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">Kuwait</td>
            <td className="border px-2 py-1">Embassy of India in Kuwait: emergency contact</td>
            <td className="border px-2 py-1">+965-22562151</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">Bahrain</td>
            <td className="border px-2 py-1">Indian Embassy in Bahrain</td>
            <td className="border px-2 py-1">00-973-17714209, 00-973-17180529</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">Qatar</td>
            <td className="border px-2 py-1">Embassy of India in Doha</td>
            <td className="border px-2 py-1">00-974-44255708</td>
          </tr>
        </tbody>
      </table>
      <p className="text-xs text-gray-500">(More details can be added here as needed.)</p>
    </div>
  ),
  "embassy-info": (
    <div>
      <h3 className="font-semibold mb-2">Indian Embassies and Consulates Information</h3>
      <table className="w-full text-sm border mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Country</th>
            <th className="border px-2 py-1">City</th>
            <th className="border px-2 py-1">Website</th>
            <th className="border px-2 py-1">Phone</th>
            <th className="border px-2 py-1">Address</th>
            <th className="border px-2 py-1">Email</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-2 py-1">UAE</td>
            <td className="border px-2 py-1">Abu Dhabi</td>
            <td className="border px-2 py-1"><a href="http://indembassyuae.gov.in" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">indembassyuae.gov.in</a></td>
            <td className="border px-2 py-1">00-971-2-4492700, 8004632 (toll free), 02-4491869 (Consular)</td>
            <td className="border px-2 py-1">Plot No: 12, Sector W-59/02, Diplomatic Area, Off Airport Road, P.O.Box:4090, Abu Dhabi</td>
            <td className="border px-2 py-1">indiansab@emirates.net.ae (General), indcon@emirates.net.ae (Consular), cgiabudhabi@mea.gov.in (Community Welfare)</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">UAE</td>
            <td className="border px-2 py-1">Dubai</td>
            <td className="border px-2 py-1"><a href="http://cgidubai.gov.in" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">cgidubai.gov.in</a></td>
            <td className="border px-2 py-1">800-46342 (800 INDIA, toll free), 00971504559594, 04-3971222 (Women/Housemaids distress line)</td>
            <td className="border px-2 py-1">Al Hamriya Diplomatic Enclave, P.O.Box:737, Dubai</td>
            <td className="border px-2 py-1">cgidubai@mea.gov.in</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">Saudi Arabia</td>
            <td className="border px-2 py-1">Riyadh</td>
            <td className="border px-2 py-1"><a href="http://indianembassy.org.sa" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">indianembassy.org.sa</a></td>
            <td className="border px-2 py-1">00-966-11-4884697 (24x7 Helpline), 00-966-11-4884144, 800 247 1234 (toll free)</td>
            <td className="border px-2 py-1">P.O. Diplomatic Quarter, P.O. Box: 94387, Riyadh-11693</td>
            <td className="border px-2 py-1">minister@indianembassy.org.sa, cons.riyadh@indianembassy.org.sa (Community Welfare)</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">Saudi Arabia</td>
            <td className="border px-2 py-1">Jeddah</td>
            <td className="border px-2 py-1"><a href="http://cgijeddah.com" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">cgijeddah.com</a></td>
            <td className="border px-2 py-1">00-966-2-6692706, 00-966-2-6608212</td>
            <td className="border px-2 py-1">Building #34, Diplomatic Area, North, Khalid Bin Waleed Road, Sharafiah, P.O. Box: 948, Jeddah-21421</td>
            <td className="border px-2 py-1">cgijeddah@mea.gov.in, cons.jeddah@mea.gov.in</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">Kuwait</td>
            <td className="border px-2 py-1">Kuwait City</td>
            <td className="border px-2 py-1"><a href="http://indembkwt.gov.in" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">indembkwt.gov.in</a></td>
            <td className="border px-2 py-1">+965-22562151</td>
            <td className="border px-2 py-1">Diplomatic Enclave, Arabian Gulf St, P.O. Box: 1450, Safat, Kuwait-13015, Kuwait</td>
            <td className="border px-2 py-1">cons1.kuwait@mea.gov.in</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">Bahrain</td>
            <td className="border px-2 py-1">Manama</td>
            <td className="border px-2 py-1">(Not listed, official site not found)</td>
            <td className="border px-2 py-1">00-973-17714209, 00-973-17180529 (after hours)</td>
            <td className="border px-2 py-1">Building 1095, Road 2819, Block 428, Seef District, P.O. Box: 26106, Manama, Bahrain</td>
            <td className="border px-2 py-1">hoc.bahrain@mea.gov.in</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">Qatar</td>
            <td className="border px-2 py-1">Doha</td>
            <td className="border px-2 py-1"><a href="http://indianembassyqatar.gov.in" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">indianembassyqatar.gov.in</a></td>
            <td className="border px-2 py-1">00-974-44255708, 00-974-55575029 (after hours)</td>
            <td className="border px-2 py-1">Plot 12, Al Eithra Street, Al Hilal Area, P.O. Box: 2788, Doha</td>
            <td className="border px-2 py-1">amb.doha@mea.gov.in, passport.doha@mea.gov.in</td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
  "associations": (
    <div>
      <h3 className="font-semibold mb-2">Indian Associations in Gulf</h3>
      <table className="w-full text-sm border mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Country</th>
            <th className="border px-2 py-1">Association Name</th>
            <th className="border px-2 py-1">Description/Activities</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-2 py-1">Bahrain</td>
            <td className="border px-2 py-1">Indian Social Club</td>
            <td className="border px-2 py-1">Main Indian community organization; open halls and facilities</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">Bahrain</td>
            <td className="border px-2 py-1">Kalasamithi (Institute of Performing Arts)</td>
            <td className="border px-2 py-1">Focuses on Indian classical arts and dance</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">Bahrain</td>
            <td className="border px-2 py-1">Telugu Association of Bahrain</td>
            <td className="border px-2 py-1">Supports Telugu-speaking expatriates through social and cultural initiatives</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">Kuwait</td>
            <td className="border px-2 py-1">India Social and Cultural Centre</td>
            <td className="border px-2 py-1">Centre hub for international and social activities</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">Kuwait</td>
            <td className="border px-2 py-1">Indian Community Welfare Committee</td>
            <td className="border px-2 py-1">Supports Indian expatriates with welfare and community services</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">Kuwait</td>
            <td className="border px-2 py-1">Kuwait Telugu Sanghamu</td>
            <td className="border px-2 py-1">Focuses on Telugu language, culture, and community support</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">Kuwait</td>
            <td className="border px-2 py-1">KalaKriti - Kuwait</td>
            <td className="border px-2 py-1">Promotes Indian arts and culture</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">Oman</td>
            <td className="border px-2 py-1">Telugu Kala Samithi, Muscat</td>
            <td className="border px-2 py-1">Celebrates Telugu festivals and supports the Telugu community</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">Qatar</td>
            <td className="border px-2 py-1">Association of Indian Professionals</td>
            <td className="border px-2 py-1">For Indian professionals in Qatar</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">Qatar</td>
            <td className="border px-2 py-1">Indian Keralite Kala Mandram</td>
            <td className="border px-2 py-1">Promotes Indian arts and culture</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">Qatar</td>
            <td className="border px-2 py-1">Telugu Association of Qatar</td>
            <td className="border px-2 py-1">Organizes Telugu cultural activities, provides community support</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">Qatar</td>
            <td className="border px-2 py-1">Indian Doctors Forum</td>
            <td className="border px-2 py-1">Indian medical professionals network</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">Saudi Arabia</td>
            <td className="border px-2 py-1">Telugu Association of Jeddah (TAJ)</td>
            <td className="border px-2 py-1">Preserve and promote Telugu language, organizes welfare activities for Telugu-speaking Indians</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">Saudi Arabia</td>
            <td className="border px-2 py-1">Telugu Association, Riyadh</td>
            <td className="border px-2 py-1">Hosts cultural and social events for Telugu expatriates (widely recognized in community directories)</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">UAE</td>
            <td className="border px-2 py-1">India Social and Cultural Centre (ISC), Abu Dhabi</td>
            <td className="border px-2 py-1">Premier socio-cultural organization, apex body for Indian associations in Abu Dhabi; hosts cultural, social, and educational events</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">UAE</td>
            <td className="border px-2 py-1">Indian Tamil Fine Arts Association</td>
            <td className="border px-2 py-1">Promotes Tamil culture and arts/culture in UAE</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">UAE</td>
            <td className="border px-2 py-1">Kalayoor Panchayati Pravasi Association</td>
            <td className="border px-2 py-1">Kerala-based, built support of Keralan Indian community network</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">UAE</td>
            <td className="border px-2 py-1">Keraleeyee - Abu Dhabi</td>
            <td className="border px-2 py-1">Kerala festival, cultural programs, and community support</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">UAE</td>
            <td className="border px-2 py-1">Telugu Association, Dubai</td>
            <td className="border px-2 py-1">Organizes Telugu festivals, cultural programs, and community support</td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
  "healthcare":
   <div><h3 className="font-semibold mb-2">Health Care</h3>Healthcare network of doctors and telehealth info (details coming soon)</div>,
  "legal": (
    <div>
      <h3 className="font-semibold mb-2">Legal</h3>
      <div className="mb-2">Domestic Workers Rights for GCC countries:<br/>
        <a href="https://www.migrant-rights.org/activity/know-your-rights-domestic-workers/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Know your rights - Domestic Workers</a>
      </div>
      <div className="mb-2">Labour Laws for GCC countries:<br/>
        <a href="https://www.migrant-rights.org/activity/know-your-rights-leaflet/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Know your rights - Labour Laws</a>
      </div>
      <div className="mb-2">Attorney List: (details coming soon)</div>
    </div>
  ),
  "insurance": <div>
    <h3 className="font-semibold mb-2">Insurance</h3>Insurance professionals and services (details coming soon)</div>,
  "pre-departure": (
    <div>
       <h3 className="font-semibold mb-2">Pre-departure</h3>
      <ul className="list-disc pl-5">
        <li>Check to make sure job designation on your visa matches with the job offered</li>
        <li>Open bank account with any bank in India before departure</li>
        <li>Carry signed copy of employment contract</li>
        <li>Always leave one copy of all documents at home</li>
        <li>Ensure your Passport is valid for at least six months</li>
        <li>Ensure you have contact numbers of your Recruiting Agent, Employer with you</li>
        <li>Always carry helpline and contact numbers of Indian Embassy, MADAD, PBSK & eMigrate</li>
        <li>Prepare a checklist of items to be packed both in check-in and hand luggage</li>
        <li>Learn basic language of the destination country</li>
        <li>For travel, do not carry any packets given by others.</li>
        <li>Do not carry religious symbols, drugs, inflammable articles & other banned items</li>
        <li>Keep your passport, visa and flight ticket ready for the day of travel</li>
      </ul>
    </div>
  ),
  "post-arrival": (
    <div>
       <h3 className="font-semibold mb-2">Post-arrival</h3>
      <ul className="list-disc pl-5">
        <li>Be mindful of local culture, beliefs and laws during your social media activity.</li>
        <li>Traffic laws of the destination country should be strictly obeyed</li>
        <li>Understand and follow your rights and obligations as per your labour contract.</li>
        <li>Know the laws and rules regarding exit from your destination country. You may need an exit visa while travelling out of your work country</li>
        <li>Get your education certificates attested as required by the laws of your country of work</li>
        <li>Keep all your important documents, contact details, telephone numbers with you</li>
        <li>Learn local etiquettes, respect local culture/customs, food habits etc</li>
      </ul>
    </div>
  ),
  "female-domestic-workers": (
    <div>
       <h3 className="font-semibold mb-2">Advice for Female Domestic Workers</h3>
      <div className="font-semibold mb-1">Do's</div>
      <ul className="list-disc pl-5 mb-2">
        <li>Always keep contact details of India Embassy, MADAD, PBSK, and eMigrate with yourself. Keep proper Employment Contract with yourself.</li>
        <li>Ensure you have the phone number of Recruiting Agent (RA) and Foreign Employer (FE). Keep contact details of local police and mission and memorize it.</li>
        <li>Ask RAs to show demand letter and PoA.</li>
        <li>Be mindful of customs specific to women.</li>
        <li>Dress modestly.</li>
        <li>Learn important phrases, know the tasks in local language.</li>
      </ul>
      <div className="font-semibold mb-1">Don'ts</div>
      <ul className="list-disc pl-5">
        <li>Do not Migrate before 30 years of age and do not hand over documents.</li>
        <li>No job from unlicensed RAs.</li>
        <li>No migration for employment without proper work visa.</li>
        <li>Sub-agents not permitted under India's Emigration Act, 1983.</li>
        <li>Don't go unprepared.</li>
        <li>Do not change jobs without permission. Don't travel on expired documents.</li>
      </ul>
      <div className="text-xs text-gray-500 mt-2">(Source: pdot.mea.gov.in)</div>
    </div>
  ),
  "arabic-words": (
    <div>
      <h3 className="font-semibold mb-2">Important Arabic words in Indian Languages</h3>
      <table className="w-full text-sm border mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Arabic (Romanized)</th>
            <th className="border px-2 py-1">English</th>
            <th className="border px-2 py-1">Telugu</th>
            <th className="border px-2 py-1">Hindi</th>
            <th className="border px-2 py-1">Malayalam</th>
          </tr>
        </thead>
        <tbody>
          <tr><td className="border px-2 py-1">Bait</td><td className="border px-2 py-1">House</td><td className="border px-2 py-1">ఇల్లు (Illu)</td><td className="border px-2 py-1">घर (Ghar)</td><td className="border px-2 py-1">വീട് (Veedu)</td></tr>
          <tr><td className="border px-2 py-1">miftāh</td><td className="border px-2 py-1">Key</td><td className="border px-2 py-1">తాళం (Taalam)</td><td className="border px-2 py-1">चाबी (Chabi)</td><td className="border px-2 py-1">ചാവി (Chaavi)</td></tr>
          <tr><td className="border px-2 py-1">Tilīfun</td><td className="border px-2 py-1">Telephone</td><td className="border px-2 py-1">టెలిఫోన్ (Teliphon)</td><td className="border px-2 py-1">टेलीफोन (Telephone)</td><td className="border px-2 py-1">ടെലിഫോൺ (Telephone)</td></tr>
          <tr><td className="border px-2 py-1">Bank/masraf</td><td className="border px-2 py-1">Bank</td><td className="border px-2 py-1">బ్యాంక్ (Bank)</td><td className="border px-2 py-1">बैंक (Bank)</td><td className="border px-2 py-1">ബാങ്ക് (Bank)</td></tr>
          <tr><td className="border px-2 py-1">Naqd</td><td className="border px-2 py-1">Cash</td><td className="border px-2 py-1">నగదు (Nagadu)</td><td className="border px-2 py-1">नकद (Nakad)</td><td className="border px-2 py-1">പരം (Param), കാശ് (Kaash)</td></tr>
          <tr><td className="border px-2 py-1">idā/widā'i</td><td className="border px-2 py-1">Deposit</td><td className="border px-2 py-1">డిపాజిట్ (Deposit)</td><td className="border px-2 py-1">जमा (Jama)</td><td className="border px-2 py-1">ഡെപ്പോസിറ്റ് (Deposit)</td></tr>
          <tr><td className="border px-2 py-1">Tabib</td><td className="border px-2 py-1">Doctor</td><td className="border px-2 py-1">డాక్టర్ (Doctor)</td><td className="border px-2 py-1">डॉक्टर (Doctor)</td><td className="border px-2 py-1">ഡോക്ടർ (Doctor)</td></tr>
          <tr><td className="border px-2 py-1">mustashfa</td><td className="border px-2 py-1">Hospital</td><td className="border px-2 py-1">ఆసుపత్రి (Aasupathri)</td><td className="border px-2 py-1">अस्पताल (Aspataal)</td><td className="border px-2 py-1">ആശുപത്രി (Aashupathri)</td></tr>
          <tr><td className="border px-2 py-1">maṭār</td><td className="border px-2 py-1">Airport</td><td className="border px-2 py-1">విమానాశ్రయం (Vimanashrayam)</td><td className="border px-2 py-1">हवाई अड्डा (Hawai Adda)</td><td className="border px-2 py-1">വിമാനത്താവളം (Vimanathavalam)</td></tr>
          <tr><td className="border px-2 py-1">Marhaba</td><td className="border px-2 py-1">Hello</td><td className="border px-2 py-1">హలో (Hello)</td><td className="border px-2 py-1">हैलो (Hello)</td><td className="border px-2 py-1">ഹലോ (Hello)</td></tr>
          <tr><td className="border px-2 py-1">Min faDlak/lau samaHt</td><td className="border px-2 py-1">Please</td><td className="border px-2 py-1">దయచేసి (Dayachesi)</td><td className="border px-2 py-1">कृपया (Kripaya)</td><td className="border px-2 py-1">ദയവായി (Dayavayi)</td></tr>
          <tr><td className="border px-2 py-1">Shukran</td><td className="border px-2 py-1">Thanks</td><td className="border px-2 py-1">ధన్యవాదాలు (Danyavad)</td><td className="border px-2 py-1">धन्यवाद (Dhanyavad)</td><td className="border px-2 py-1">നന്ദി (Nandi)</td></tr>
          <tr><td className="border px-2 py-1">na'am/Laa (kalla)</td><td className="border px-2 py-1">Yes/No</td><td className="border px-2 py-1">అవును/కాదు (Avunu/Kadu)</td><td className="border px-2 py-1">हाँ/नहीं (Haan/Nahin)</td><td className="border px-2 py-1">അതെ/ഇല്ല (Athe/Illaa)</td></tr>
          <tr><td className="border px-2 py-1">Rub- bama</td><td className="border px-2 py-1">Maybe</td><td className="border px-2 py-1">భలుసా (Bhalusa)</td><td className="border px-2 py-1">शायद (Shayad)</td><td className="border px-2 py-1">ഒരുപക്ഷം (Orupaksham)</td></tr>
          <tr><td className="border px-2 py-1">afwan</td><td className="border px-2 py-1">Excuse me</td><td className="border px-2 py-1">క్షమించండి (Kshaminchandi)</td><td className="border px-2 py-1">माफ कीजिए (Maaf kijiye)</td><td className="border px-2 py-1">ക്ഷമിക്കണം (Kshamikkanam)</td></tr>
          <tr><td className="border px-2 py-1">Aasif, ghalTatee</td><td className="border px-2 py-1">Sorry, my mistake</td><td className="border px-2 py-1">క్షమించండి, నా తప్పు (Kshaminchandi, naa tappu)</td><td className="border px-2 py-1">क्षमा करें, मेरी गलती (Kshama karein, meri galti)</td><td className="border px-2 py-1">ക്ഷമിക്കണം, എന്റെ തെറ്റ് (Kshamikkanam, ente thettu)</td></tr>
          <tr><td className="border px-2 py-1">Limaadha</td><td className="border px-2 py-1">Why?</td><td className="border px-2 py-1">ఎందుకు (Enduku)</td><td className="border px-2 py-1">क्यों (Kyun)</td><td className="border px-2 py-1">എന്തിന് (Entin)</td></tr>
          <tr><td className="border px-2 py-1">Ayy</td><td className="border px-2 py-1">Which?</td><td className="border px-2 py-1">ఏది (Eedi)</td><td className="border px-2 py-1">कौन सा (Kaun sa)</td><td className="border px-2 py-1">എന്ത് (Enthe)</td></tr>
          <tr><td className="border px-2 py-1">Kaif</td><td className="border px-2 py-1">How?</td><td className="border px-2 py-1">ఎలా (Ela)</td><td className="border px-2 py-1">कैसे (Kaise)</td><td className="border px-2 py-1">എങ്ങനേ (Engane)</td></tr>
          <tr><td className="border px-2 py-1">Matta</td><td className="border px-2 py-1">When?</td><td className="border px-2 py-1">ఎప్పుడు (Eppudu)</td><td className="border px-2 py-1">कब (Kab)</td><td className="border px-2 py-1">എപ്പോള് (Eppol)</td></tr>
          <tr><td className="border px-2 py-1">Qabl</td><td className="border px-2 py-1">Before</td><td className="border px-2 py-1">ముందు (Mundu)</td><td className="border px-2 py-1">पहले (Pehle)</td><td className="border px-2 py-1">മുമ്പ് (Mump)</td></tr>
          <tr><td className="border px-2 py-1">ba'ad</td><td className="border px-2 py-1">After</td><td className="border px-2 py-1">తర్వత (Tarvata)</td><td className="border px-2 py-1">बाद में (Baad mein)</td><td className="border px-2 py-1">ശേഷം (Shesham)</td></tr>
          <tr><td className="border px-2 py-1">Abadan</td><td className="border px-2 py-1">Never</td><td className="border px-2 py-1">ఎప్పుడూ కాదు (Eppudu kaadu)</td><td className="border px-2 py-1">कभी नहीं (Kabhi nahin)</td><td className="border px-2 py-1">ഒരിക്കലും ഇല്ല (Orikkalum illa)</td></tr>
          <tr><td className="border px-2 py-1">aHayaanan</td><td className="border px-2 py-1">Sometimes</td><td className="border px-2 py-1">కొన్నిసార్లు (Konnisarlu)</td><td className="border px-2 py-1">कभी-कभी (Kabhi-kabhi)</td><td className="border px-2 py-1">ചിലപ്പോള് (Chilappol)</td></tr>
          <tr><td className="border px-2 py-1">Ain</td><td className="border px-2 py-1">Where?</td><td className="border px-2 py-1">ఎక్కడ (Ekkada)</td><td className="border px-2 py-1">कहाँ (Kahan)</td><td className="border px-2 py-1">എവിടെ (Evide)</td></tr>
        </tbody>
      </table>
    </div>
  ),
  "contact-nice": (
    <div>
      <div className="font-semibold">Contact NICE</div>
      <div>Email: <a href="mailto:NICE-Info@InternationalMatters.org" className="text-blue-600 underline">NICE-Info@InternationalMatters.org</a></div>
    </div>
  ),
};

const Resources = () => {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold mb-6">Resources</h1>
      <div className="grid gap-4">
        <Card className="p-4">
          <div className="space-y-2">
            {resourceSections.map(section => (
              <Button
                key={section.key}
                variant={selectedSection === section.key ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setSelectedSection(section.key)}
              >
                {section.label}
              </Button>
            ))}
          </div>
        </Card>
        {selectedSection && (
          <Card className="p-4 mt-2">
            {sectionDetails[selectedSection] || <div>Details coming soon...</div>}
          </Card>
        )}
      </div>
    </div>
  );
};

export default Resources;
