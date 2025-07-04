"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [overview, setOverview] = useState<{
    users?: { id: string; name: string; email: string; role: string }[];
    vendors?: { id: string; user: { name: string }; type: string; address: string }[];
    menuItems?: { id: string; name: string; price: number; vendor?: { user?: { name: string } } }[];
    reviews?: { id: string; user?: { name: string }; vendor?: { user?: { name: string } }; rating: number; comment: string }[];
    reservations?: { id: string; user?: { name: string }; vendor?: { user?: { name: string } }; date: string; status: string }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user || session.user.role !== "admin") {
      setUnauthorized(true);
      setLoading(false);
      return;
    }
    // Fetch admin overview data
    fetch("/api/admin/overview")
      .then((res) => res.json())
      .then((data) => {
        setOverview(data);
        setLoading(false);
      });
  }, [session, status]);

  if (loading) {
    return <div className="p-8">Loading admin dashboard...</div>;
  }
  if (unauthorized) {
    return <div className="p-8 text-red-600 font-bold">Unauthorized: Admins only</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="menu">Menu Items</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="reservations">Reservations</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {overview?.users?.map((user) => (
                  <li key={user.id} className="mb-2">
                    <span className="font-semibold">{user.name}</span> ({user.email}) - {user.role}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="vendors">
          <Card>
            <CardHeader>
              <CardTitle>Vendors</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {overview?.vendors?.map((vendor) => (
                  <li key={vendor.id} className="mb-2">
                    <span className="font-semibold">{vendor.user.name}</span> - {vendor.type} ({vendor.address})
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="menu">
          <Card>
            <CardHeader>
              <CardTitle>Menu Items</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {overview?.menuItems?.map((item) => (
                  <li key={item.id} className="mb-2">
                    <span className="font-semibold">{item.name}</span> - {item.price} ({item.vendor?.user?.name})
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {overview?.reviews?.map((review) => (
                  <li key={review.id} className="mb-2">
                    <span className="font-semibold">{review.user?.name}</span> on {review.vendor?.user?.name}: {review.rating}★ - {review.comment}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reservations">
          <Card>
            <CardHeader>
              <CardTitle>Reservations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {overview?.reservations?.map((res) => (
                  <li key={res.id} className="mb-2">
                    <span className="font-semibold">{res.user?.name}</span> at {res.vendor?.user?.name} on {new Date(res.date).toLocaleDateString()} ({res.status})
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 