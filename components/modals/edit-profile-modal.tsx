"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "@/components/ui/use-toast";

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProfileSaved: (profile: any) => void;
  initialProfile?: any;
}

export function EditProfileModal({ open, onOpenChange, onProfileSaved, initialProfile }: EditProfileModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && initialProfile) {
      setName(initialProfile.name || "");
      setPhone(initialProfile.phone || "");
    }
  }, [open, initialProfile]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("You must be logged in.");
      const profileDocRef = doc(db, "users", user.uid, "profile", "basic");
      await setDoc(profileDocRef, { name, phone });
      toast({ title: "Profile updated!", description: "Your profile details were saved." });
      onProfileSaved({ name, phone });
      onOpenChange(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to save profile.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Your phone number" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
