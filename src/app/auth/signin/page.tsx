import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Youtube, Instagram } from "lucide-react";

export default async function SignIn() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to Creator Dashboard</CardTitle>
          <p className="text-muted-foreground mt-2">
            Connect your accounts to start tracking
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action="/api/auth/signin/google" method="POST">
            <input type="hidden" name="csrfToken" value="" />
            <Button 
              type="submit" 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 h-12"
            >
              <Youtube className="h-5 w-5 text-red-600" />
              Continue with YouTube (Google)
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <form action="/api/auth/signin/facebook" method="POST">
            <input type="hidden" name="csrfToken" value="" />
            <Button 
              type="submit"
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 h-12"
            >
              <Instagram className="h-5 w-5 text-pink-600" />
              Continue with Instagram
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground mt-4">
            By connecting, you agree to our Terms and Privacy Policy.
            <br />
            7-day free trial, then $10/month.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
