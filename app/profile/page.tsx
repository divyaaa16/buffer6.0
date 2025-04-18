"use client";
import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { UserIcon, SettingsIcon } from "lucide-react";
import AuthForm from "@/components/auth-form";
import { useComplaintContext } from "@/components/complaint-context";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";


// ComplaintHistoryItem type comes from context


import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { EditProfileModal } from "@/components/modals/edit-profile-modal"

function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const { complaints } = useComplaintContext();
  const [sosContacts, setSosContacts] = useState<any | null>(null);
  const [profileDetails, setProfileDetails] = useState<any | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchSosContacts = async () => {
      if (user) {
        const sosDocRef = doc(db, "users", user.uid, "profile", "sosContacts");
        const sosDocSnap = await getDoc(sosDocRef);
        if (sosDocSnap.exists()) {
          setSosContacts(sosDocSnap.data());
        } else {
          setSosContacts(null);
        }
      }
    };
    fetchSosContacts();
  }, [user]);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      if (user) {
        const profileDocRef = doc(db, "users", user.uid, "profile", "basic");
        const profileSnap = await getDoc(profileDocRef);
        if (profileSnap.exists()) {
          setProfileDetails(profileSnap.data());
        } else {
          setProfileDetails(null);
        }
      }
    };
    fetchProfileDetails();
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen bg-purple-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Auth section */}
          {!user && (
            <div className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Login Required</CardTitle>
                  <CardDescription>
                    Please log in to view your profile and complaint history.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AuthForm onAuth={setUser} />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Profile info if signed in */}
          {user && (
            <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
              <div className="w-full md:w-1/3">
                <Card className="shadow-lg border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-white">
                  <CardContent className="pt-8 pb-8 flex flex-col items-center">
                    <Avatar className="h-28 w-28 mb-4 bg-purple-200">
                      <UserIcon className="h-16 w-16 text-purple-600" />
                    </Avatar>
                    {profileDetails?.name && (
                      <h2 className="text-2xl font-extrabold text-purple-800 mb-1 tracking-wide">{profileDetails.name}</h2>
                    )}
                    {profileDetails?.phone && (
                      <p className="text-base text-gray-700 mb-1 font-medium">📞 {profileDetails.phone}</p>
                    )}
                    <h2 className="text-lg font-bold text-gray-900 mb-1 break-all">{user.email}</h2>
                    <p className="text-xs text-gray-400 mb-5">User ID: <span className="font-mono">{user.uid}</span></p>
                    <Button variant="outline" className="w-full font-semibold text-purple-700 border-purple-300 hover:bg-purple-50 transition" onClick={() => setEditModalOpen(true)}>
                      Edit Profile
                    </Button>
                    <EditProfileModal
                      open={editModalOpen}
                      onOpenChange={setEditModalOpen}
                      onProfileSaved={setProfileDetails}
                      initialProfile={profileDetails}
                    />
                  </CardContent>
                </Card>
                {/* SOS Contacts Section */}
                <Card className="mt-6 shadow border-purple-100 bg-gradient-to-br from-white to-purple-50">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-purple-700">My SOS Contacts</CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      Emergency contacts saved for SOS help.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {sosContacts ? (
                      <div className="space-y-4">
                        <div className="p-2 rounded bg-purple-50 border border-purple-100">
                          <span className="font-semibold text-purple-800">Contact 1:</span> {sosContacts.contact1Name} <br />
                          <span className="text-xs text-gray-600">{sosContacts.contact1Phone}</span>
                        </div>
                        <div className="p-2 rounded bg-purple-50 border border-purple-100">
                          <span className="font-semibold text-purple-800">Contact 2:</span> {sosContacts.contact2Name} <br />
                          <span className="text-xs text-gray-600">{sosContacts.contact2Phone}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-purple-800">Message:</span>
                          <div className="text-sm bg-gray-100 rounded p-2 mt-1 border border-dashed border-purple-200">
                            {sosContacts.message}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">No SOS contacts saved.</span>
                    )}
                  </CardContent>
                </Card>
              </div>
              <div className="w-full md:w-2/3">
                <Tabs defaultValue="history">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="history">My History</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                  <TabsContent value="history" className="mt-4">
                    <Card className="shadow border border-purple-100 bg-white">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold text-purple-700">My Complaint History</CardTitle>
                        <CardDescription className="text-sm text-gray-500">
                          {complaints.length === 0
                            ? "No complaints found."
                            : "Here are your filed complaints."}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-5">
                          {complaints.map((item: any, idx: number) => (
                            <div key={item.id || idx} className="p-5 border rounded-lg shadow-sm bg-purple-50 border-purple-100">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="font-semibold text-purple-900 text-lg">{item.title}</h3>
                                  <p className="text-xs text-gray-500">
                                    Filed: {item.date || "Unknown"}
                                  </p>
                                </div>
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-semibold">
                                  {item.status || "Pending"}
                                </span>
                              </div>
                              <p className="text-sm mb-3 text-gray-700">{item.description}</p>
                              <Button variant="outline" size="sm" className="font-semibold text-purple-700 border-purple-300 hover:bg-purple-100 transition">
                                View Details
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="settings" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                        <CardDescription>Manage your account preferences and security</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {/* ...settings content as before... */}
                        <Button variant="outline" size="sm" className="w-full">
                          <SettingsIcon className="h-4 w-4 mr-2" />
                          Change Password
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </div>
      </main>
      {/* About Us section at the bottom */}
      <div className="max-w-4xl mx-auto mt-16 mb-16 px-2 md:px-0">
        <Card className="shadow-lg bg-gradient-to-br from-purple-50 to-white border-none">
          <CardHeader className="pb-2 pt-6 md:pt-8">
            <CardTitle className="text-3xl md:text-4xl text-purple-700 mb-2">About Us</CardTitle>
            <CardDescription className="text-base md:text-lg">
              Learn more about our mission and the team behind the Women’s Safety Chatbot.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 pb-6 md:pb-8">
            <p className="text-base md:text-lg mb-3">
              Our platform is dedicated to empowering women by providing a safe space to report complaints, seek help, and access resources. We believe in the power of technology to foster safety and community support.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              If you have questions or suggestions, please contact us at <a href="mailto:support@womensafety.com" className="underline text-purple-700">support@womensafety.com</a>.
            </p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}

export default ProfilePage;