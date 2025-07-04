import Link from "next/link";
import { ChefHat } from "lucide-react";
import { UserMenu } from "@/components/auth/user-menu";

export default function MainHeader() {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900">Kula Chipo</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/vendors" className="text-gray-700 hover:text-orange-500 font-medium">
            Find Vendors
          </Link>
          <Link href="/experiences" className="text-gray-700 hover:text-orange-500 font-medium">
            Experiences
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <UserMenu />
        </div>
      </div>
    </header>
  );
} 