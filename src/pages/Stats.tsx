
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import StatsDisplay from "@/components/StatsDisplay";
import ThemeToggle from "@/components/ThemeToggle";

const Stats = () => {
  return (
    <Layout>
      <motion.div
        className="w-full max-w-md mx-auto pt-6 pb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Statistics</h1>
          <ThemeToggle />
        </div>
        
        <StatsDisplay />
      </motion.div>
    </Layout>
  );
};

export default Stats;
