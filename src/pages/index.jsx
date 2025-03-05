import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const index = () => {
  return (
    <main className="flex flex-col items-center justify-center flex-grow p-6 text-center">
      <Card className="max-w-2xl shadow-lg">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold mb-4">
            Welcome to the Knowledge Testing Platform
          </h1>
          <p className="text-gray-600 mb-6">
            Easily create, manage, and participate in student knowledge
            assessments.
          </p>
          <Button className="mr-2" variant="default" size="lg" href="/register">
            Get Started
          </Button>
          <Button variant="outline" size="lg" href="/login">
            Login
          </Button>
        </CardContent>
      </Card>
    </main>
  );
};

export default index;
