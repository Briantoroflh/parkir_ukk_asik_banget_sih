using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;

namespace backend.Helpers
{
    public class DBHelper
    {
        public async Task<IEnumerable<T>> ToModel<T>(string conn, string sql)
        {
            var DB = new MySqlConnection(conn);
            try
            {
                if (DB.State == System.Data.ConnectionState.Closed)
                {
                    DB.Open();
                }

                var q = await DB.QueryAsync<T>(sql, null, null, null, System.Data.CommandType.Text);
                return q;

            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (DB.State == System.Data.ConnectionState.Open)
                {
                    DB.Close();
                }
                DB.Dispose();
            }
        }

        public async Task<T> ToSingleModel<T>(string conn, string sql)
        {
            var DB = new MySqlConnection(conn);
            try
            {
                if (DB.State == System.Data.ConnectionState.Closed)
                {
                    DB.Open();
                }

                var q = await DB.QueryFirstOrDefaultAsync<T>(sql, null, null, null, System.Data.CommandType.Text);
                return q;

            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (DB.State == System.Data.ConnectionState.Open)
                {
                    DB.Close();
                }
                DB.Dispose();
            }
        }

        public async Task<int> ExecuteQuery(string conn, string sql)
        {
            var DB = new MySqlConnection(conn);
            try
            {
                if (DB.State == System.Data.ConnectionState.Closed)
                {
                    DB.Open();
                }

                var q = await DB.ExecuteAsync(sql, null, null, null, System.Data.CommandType.Text);
                return q;

            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (DB.State == System.Data.ConnectionState.Open)
                {
                    DB.Close();
                }
                DB.Dispose();
            }
        }
    }
}