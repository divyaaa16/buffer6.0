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


function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const { complaints } = useComplaintContext();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

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
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center">
                      <Avatar className="h-24 w-24 mb-4">
                        <UserIcon className="h-12 w-12" />
                      </Avatar>
                      <h2 className="text-xl font-bold">{user.email}</h2>
                      <p className="text-sm text-gray-500 mb-4">User ID: {user.uid}</p>
                      <Button variant="outline" className="w-full">
                        Edit Profile
                      </Button>
                    </div>
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
                    <Card>
                      <CardHeader>
                        <CardTitle>My Complaint History</CardTitle>
                        <CardDescription>
                          {complaints.length === 0
                            ? "No complaints found."
                            : "Here are your filed complaints."}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {complaints.map((item: any, idx: number) => (
                            <div key={item.id || idx} className="p-4 border rounded-md">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="font-medium">{item.title}</h3>
                                  <p className="text-sm text-gray-500">
                                    Filed: {item.date || "Unknown"}
                                  </p>
                                </div>
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                  {item.status || "Pending"}
                                </span>
                              </div>
                              <p className="text-sm mb-3">{item.description}</p>
                              <Button variant="outline" size="sm">
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