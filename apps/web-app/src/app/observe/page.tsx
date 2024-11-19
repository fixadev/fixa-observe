import LatencyChart from "~/components/observe/LatencyChart";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function ObservePage() {
  return (
    <div className="container">
      <Card>
        <CardHeader>
          <CardTitle>Latency</CardTitle>
        </CardHeader>
        <CardContent>
          <LatencyChart />
        </CardContent>
      </Card>
    </div>
  );
}
