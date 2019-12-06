//Weapon Value
#include<bits/stdc++.h>
#include<stdlib.h>
#include<bitset>
using namespace std;

int main()
{
    int T;
    cin>>T;

    for(int i = 0; i < T; i++)
    {
        int N;
        cin>>N;

        vector<string> A;
        string a;
        for(int j = 0; j < N; j++)
        {
            cin>>a;
            A.push_back(a);
        }

        int count = 0;
        string result;
        for(int k = 0; k < N - 1; k++)
            result = ((bitset<32>(A[k]) ^ bitset<32>(A[k + 1]))).to_string();


        for(int j = 22; j < 31; j++)
            count += int(result[j] - '0');

        cout<<count<<endl;

    }

    return 0;
}
