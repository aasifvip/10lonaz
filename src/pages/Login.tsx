import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl">Client Portal</CardTitle>
              <CardDescription>
                Client login functionality coming soon
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                We're building a secure client portal where you'll be able to:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 text-left max-w-sm mx-auto">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>View your project progress and milestones</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Access invoices and payment history</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Communicate directly with your development team</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Download project deliverables and documentation</span>
                </li>
              </ul>
              <div className="pt-6">
                <p className="text-sm text-muted-foreground">
                  For now, please <a href="/contact" className="text-primary hover:underline">contact us</a> directly for any project-related inquiries.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
