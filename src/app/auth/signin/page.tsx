import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Youtube, Instagram } from "lucide-react";
import { signIn } from "next-auth/react";

// OAuth enabled - v2
export default function SignIn() {
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
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 h-12"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            <Youtube className="h-5 w-5 text-red-600" />
            Continue with YouTube
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 h-12"
            disabled
          >
            <Instagram className="h-5 w-5 text-pink-600" />
            Continue with Instagram (Coming Soon)
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-4">
            7-day free trial, then $10/month.
            <br />
            No credit card required.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
