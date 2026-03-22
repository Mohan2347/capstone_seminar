"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Briefcase, Building2, Filter, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Internship {
  id: string;
  title: string;
  description: string;
  location: string | null;
  workType: string | null;
  duration: string | null;
  stipend: string | null;
  industry: string | null;
  requiredSkills: string[];
  openings: number;
  deadline: string | null;
  company: { name: string; logoUrl: string | null; industry: string | null };
}

const WORK_TYPE_LABELS: Record<string, string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "On-site",
};

export default function BrowseInternshipsPage() {
  const router = useRouter();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("all");
  const [workType, setWorkType] = useState("all");

  const limit = 12;

  const fetchInternships = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set("search", search);
    if (industry && industry !== "all") params.set("industry", industry);
    if (workType && workType !== "all") params.set("workType", workType);

    const res = await fetch(`/api/internships?${params}`);
    const data = await res.json();
    setInternships(data.internships ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [page, search, industry, workType]);

  useEffect(() => {
    fetchInternships();
  }, [fetchInternships]);

  const totalPages = Math.ceil(total / limit);

  const handleSearch = () => {
    setPage(1);
    fetchInternships();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Browse Internships</h1>
        <p className="text-muted-foreground">
          {total > 0 ? `${total} opportunities available` : "Discover your next opportunity"}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9 bg-card border-border"
          />
        </div>

        <Select value={industry} onValueChange={(v) => { setIndustry(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-44 bg-card border-border">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            <SelectItem value="Technology">Technology</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Healthcare">Healthcare</SelectItem>
            <SelectItem value="Engineering">Engineering</SelectItem>
            <SelectItem value="Design">Design</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
          </SelectContent>
        </Select>

        <Select value={workType} onValueChange={(v) => { setWorkType(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-40 bg-card border-border">
            <SelectValue placeholder="Work Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
            <SelectItem value="onsite">On-site</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleSearch} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : internships.length === 0 ? (
        <div className="text-center py-24">
          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">No internships found.</p>
          <p className="text-muted-foreground text-sm mt-1">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {internships.map((internship) => (
            <Card
              key={internship.id}
              className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer hover:shadow-md group"
              onClick={() => router.push(`/internships/${internship.id}`)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 text-sm leading-snug mb-1">
                      {internship.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Building2 className="h-3.5 w-3.5 shrink-0" />
                      <span className="text-xs truncate">{internship.company.name}</span>
                    </div>
                  </div>
                  {internship.workType && (
                    <Badge
                      variant="secondary"
                      className="shrink-0 text-xs bg-secondary/30 text-secondary-foreground border-secondary/50"
                    >
                      {WORK_TYPE_LABELS[internship.workType] ?? internship.workType}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-3">
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {internship.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {internship.location && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {internship.location}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1">
                  {internship.requiredSkills.slice(0, 3).map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="text-xs border-border text-muted-foreground py-0"
                    >
                      {skill}
                    </Badge>
                  ))}
                  {internship.requiredSkills.length > 3 && (
                    <Badge variant="outline" className="text-xs border-border text-muted-foreground py-0">
                      +{internship.requiredSkills.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-border">
                  <span className="text-xs text-muted-foreground">{internship.duration}</span>
                  {internship.stipend && (
                    <span className="text-xs font-medium text-primary">{internship.stipend}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="border-border text-foreground"
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground px-2">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="border-border text-foreground"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
