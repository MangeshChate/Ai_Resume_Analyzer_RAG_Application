import React from "react";
import FeatureCard from "./FeatureCard";
import { FiStar, FiCheckCircle, FiArrowRight } from "react-icons/fi";

const FeaturesSection = () => (
  <section className="py-20 p-4 bg-indigo-600">
    <div className="max-w-6xl mx-auto text-center">
      <h2 className="text-3xl font-bold  mb-12 text-light">Why Choose Us?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          icon={<FiStar className="h-12 w-12 text-yellow-500" />}
          title="Instant Analysis"
          description="Get quick feedback on your resume within seconds."
        />
        <FeatureCard
          icon={<FiCheckCircle className="h-12 w-12 text-green-500" />}
          title="Tailored Suggestions"
          description="Receive personalized improvement suggestions to enhance your resume."
        />
        <FeatureCard
          icon={<FiArrowRight className="h-12 w-12 " />}
          title="User-Friendly"
          description="Simple and intuitive design for ease of use."
        />
      </div>
    </div>
  </section>
);

export default FeaturesSection;
