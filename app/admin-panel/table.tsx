import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TableDemo({ data, onEdit, onDelete }: any) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <div className="overflow-auto">
      <Table>
        <TableCaption>A list of clients accounts.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">SR No</TableHead>
            <TableHead>User Name</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Enagement Rate (%)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>One linear</TableHead>
            <TableHead>Eng Change (%)</TableHead>
            <TableHead>User</TableHead>
            <TableHead>updated At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((d: any, i: number) => {
            return (
              <TableRow key={i}>
                <TableCell className="font-medium">{i + 1}</TableCell>
                <TableCell className="font-medium">{d.username}</TableCell>
                <TableCell>{d.grade === "" ? "-" : d.grade}</TableCell>
                <TableCell>
                  {d.enagementRate === "" ? "-" : d.enagementRate}
                </TableCell>
                <TableCell>{d.status === "" ? "-" : d.status}</TableCell>
                <TableCell>{d.oneLinear === "" ? "-" : d.oneLinear}</TableCell>
                <TableCell>
                  {d.enageChange === "" ? "-" : d.enageChange}
                </TableCell>
                <TableCell>{d.user ?? "-"}</TableCell>
                <TableCell>{formatDate(d.updateAt)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(d)}
                      className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-100 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(d)}
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-100 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
