import React from "react";

interface Hashtag {
  name: string;
  count: number;
  interaction: number;
}

interface HashtagListProps {
  hashtags: Hashtag[];
}

const HashtagList: React.FC<HashtagListProps> = ({ hashtags }) => {
  return (
    <div className="max-w-2xl mx-auto p-4 border border-gray-300 rounded-lg bg-white">
      <h2 className="text-center text-2xl font-semibold mb-4">Hashtags list</h2>
      <div className="max-h-[470px] print:h-full  overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hashtag
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Number of uses
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {hashtags.map((hashtag, index) => (
              <tr key={index}>
                <td className="px-6 py-4 font-semibold whitespace-nowrap">
                  {hashtag.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{hashtag.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50 text-center">
        <p>
          Use the hashtag feature to create lists, find the best hashtags for
          your profile and find out if you have used penalizing hashtags.
        </p>
      </div> */}
    </div>
  );
};

export default HashtagList;
