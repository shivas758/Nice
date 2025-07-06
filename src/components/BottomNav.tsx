import { Home, User, Users, HeartHandshake, BookOpen, GamepadIcon, MessageSquare, AlertTriangle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: User, label: "My NICE!", path: "/profile" },
  { icon: Users, label: "Network", path: "/network" },
  // { icon: HeartHandshake, label: "Support", path: "/support" },
  { icon: BookOpen, label: "Resources", path: "/resources" },
  // { icon: GamepadIcon, label: "Games", path: "/games" },
  { icon: MessageSquare, label: "Forums", path: "/forums" },
];

export const BottomNav = () => {
  const location = useLocation();
  const [sosOpen, setSosOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (sosOpen && user?.id) {
      supabase
        .from("profiles")
        .select(
          "first_name, last_name, gcc_phone, emergency_contact_1, emergency_contact_2, emergency_contact_3, emergency_contact_4, emergency_contact_5, emergency_contact_5_country"
        )
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setProfile(data);
            const contactList = [
              data.emergency_contact_1 && { label: "Emergency Contact 1 (India)", value: data.emergency_contact_1 },
              data.emergency_contact_2 && { label: "Emergency Contact 2 (India)", value: data.emergency_contact_2 },
              data.emergency_contact_3 && { label: "Emergency Contact 3 (Gulf)", value: data.emergency_contact_3 },
              data.emergency_contact_4 && { label: "Emergency Contact 4 (Gulf)", value: data.emergency_contact_4 },
              data.emergency_contact_5 && { label: `Emergency Contact 5 (${data.emergency_contact_5_country || "Gulf"})`, value: data.emergency_contact_5 },
            ].filter(Boolean);
            setContacts(contactList);
            setSelectedContacts(contactList.map(c => c.value));
          }
        });
    }
  }, [sosOpen, user]);

  const handleToggleContact = (value) => {
    setSelectedContacts((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const getLocationString = () => {
    if (navigator.geolocation) {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            resolve(`https://maps.google.com/?q=${latitude},${longitude}`);
          },
          () => resolve("Location not available"),
          { timeout: 5000 }
        );
      });
    }
    return Promise.resolve("Location not available");
  };

  const getSosEndpoint = () =>
    import.meta.env.DEV
      ? 'https://nicebackend.netlify.app/.netlify/functions/send-sos'
      : '/.netlify/functions/send-sos';

  const hasInvalidNumbers = contacts
    .filter(c => selectedContacts.includes(c.value))
    .some(c => !c.value.startsWith('+'));

  const handleSendSOS = async () => {
    const selectedNumbers = contacts
      .filter(c => selectedContacts.includes(c.value))
      .map(c => c.value);
    if (selectedNumbers.some(num => !num.startsWith('+'))) {
      toast({
        title: "Invalid Number Format",
        description: "All selected numbers must start with + and country code (E.164 format). Please update your emergency contacts.",
        variant: "destructive",
      });
      return;
    }
    let locationUrl = "Location not available";
    try {
      locationUrl = String(await getLocationString());
    } catch {}
    try {
      await fetch(getSosEndpoint(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numbers: selectedNumbers,
          name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Unknown',
          senderNumber: profile?.gcc_phone || 'Unknown',
          location: locationUrl,
        }),
      });
      toast({
        title: "Emergency Alert Sent!",
        description: `Alert sent to: ${selectedNumbers.join(", ")}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send SOS alert.",
        variant: "destructive",
      });
    }
    setSosOpen(false);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200 py-2 px-4 z-50">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-2 min-w-[4rem] transition-all duration-200 ${
                isActive 
                  ? "text-primary scale-110" 
                  : "text-gray-600 hover:text-primary/80"
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-200 ${
                isActive ? "animate-bounce" : ""
              }`} />
              <span className="text-[0.65rem] mt-1 whitespace-nowrap font-medium">{item.label}</span>
            </Link>
          );
        })}
        {/* SOS Menu Item */}
        <button
          onClick={() => setSosOpen(true)}
          className="flex flex-col items-center p-2 min-w-[4rem] text-red-600 hover:text-red-700 font-bold focus:outline-none"
        >
          <AlertTriangle className="w-5 h-5" />
          <span className="text-[0.65rem] mt-1 whitespace-nowrap font-medium">SOS</span>
        </button>
      </div>
      {/* SOS Confirmation Dialog */}
      <Dialog open={sosOpen} onOpenChange={setSosOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>SOS Emergency Alert</DialogTitle>
          </DialogHeader>
          {contacts.length === 0 ? (
            <p>No emergency contacts found in your profile.</p>
          ) : (
            <>
              <p>Select which emergency contacts to alert:</p>
              {hasInvalidNumbers && (
                <div className="text-red-600 text-sm font-semibold mb-2">
                  Warning: All numbers must start with + and country code (E.164 format)!
                </div>
              )}
              <form className="space-y-2 my-2">
                {contacts.map((contact, idx) => (
                  <label key={idx} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedContacts.includes(contact.value)}
                      onChange={() => handleToggleContact(contact.value)}
                    />
                    <span>{contact.label}: {contact.value}</span>
                  </label>
                ))}
              </form>
              <div className="flex gap-4 mt-4">
                <Button onClick={handleSendSOS} className="bg-red-600 text-white">Send Alert</Button>
                <Button variant="outline" onClick={() => setSosOpen(false)}>Cancel</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </nav>
  );
};
